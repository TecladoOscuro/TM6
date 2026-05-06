import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, CheckCircle, Thermometer, Gauge, Timer } from 'lucide-react'
import { useRecipeStore } from '../stores/recipeStore'

export default function CookingModePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, getRecipe, init } = useRecipeStore()

  useEffect(() => {
    if (recipes.length === 0) {
      init()
    }
  }, [])

  const recipe = id ? getRecipe(id) : undefined
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Wake lock
  useEffect(() => {
    let wakeLock: any = null
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen')
        }
      } catch {}
    }
    requestWakeLock()
    return () => {
      if (wakeLock) wakeLock.release()
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="animate-pulse text-[var(--color-text-tertiary)]">Cargando...</div>
      </div>
    )
  }

  const steps = recipe.steps
  const step = steps[currentStep]

  const startTimer = () => {
    if (remainingSeconds === 0 && step) {
      setRemainingSeconds(Math.round(step.time * 60))
    }
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setIsRunning(false)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MT6 Recetas', { body: `Paso ${step.stepNumber} completado` })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const resetTimer = () => {
    pauseTimer()
    setRemainingSeconds(Math.round(step.time * 60))
  }

  const goNext = () => {
    pauseTimer()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setRemainingSeconds(0)
    }
  }

  const goPrev = () => {
    pauseTimer()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setRemainingSeconds(0)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const timerTotal = Math.round(step.time * 60)

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--color-border)]">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-[var(--color-text)] truncate">{recipe.title}</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all ${
              i < currentStep ? 'bg-[var(--color-accent)]'
              : i === currentStep ? 'bg-[var(--color-accent)]'
              : 'bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>

      {/* Steps list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {steps.map((s, i) => {
            const isActive = i === currentStep
            const isDone = i < currentStep
            return (
              <motion.button
                key={i}
                onClick={() => { pauseTimer(); setCurrentStep(i); setRemainingSeconds(0) }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-sm'
                    : isDone
                    ? 'border-[var(--color-border)] bg-[var(--color-surface-alt)]/50'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-alt)]'
                }`}
                animate={isActive ? { scale: [1, 1.01, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isDone ? 'bg-[var(--color-accent)] text-white'
                    : isActive ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                    : 'bg-[var(--color-border)] text-[var(--color-text-tertiary)]'
                  }`}>
                    {isDone ? <CheckCircle size={18} /> : <span className="text-sm font-bold">{s.stepNumber}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${isDone ? 'text-[var(--color-text-tertiary)]' : 'text-[var(--color-text)]'}`}>
                      {s.instruction}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.temperature !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-danger)]/10 rounded-lg text-[10px] font-medium text-[var(--color-danger)]">
                          <Thermometer size={10} />
                          {s.temperature === 'varoma' ? 'Varoma' : `${s.temperature}°C`}
                        </span>
                      )}
                      {s.speed !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent)]/10 rounded-lg text-[10px] font-medium text-[var(--color-accent)]">
                          <Gauge size={10} />
                          Vel {typeof s.speed === 'number' ? s.speed : s.speed}
                        </span>
                      )}
                      {s.time > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-warning)]/10 rounded-lg text-[10px] font-medium text-[var(--color-warning)]">
                          <Timer size={10} />
                          {s.time < 1 ? `${Math.round(s.time * 60)}s` : `${s.time} min`}
                        </span>
                      )}
                      {s.reverse && <span className="px-2 py-0.5 text-[10px]">↩ Giro inv</span>}
                      {s.accessory && <span className="px-2 py-0.5 text-[10px]">⚙ {s.accessory}</span>}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Timer + Controls */}
      {step.time > 0 && (
        <div className="border-t border-[var(--color-border)] px-4 py-4">
          {/* Timer display */}
          <div className="text-center mb-4">
            <motion.div
              key={`${currentStep}-${remainingSeconds}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-[var(--color-text)] tracking-tight"
            >
              {remainingSeconds > 0 ? formatTime(remainingSeconds) : formatTime(timerTotal)}
            </motion.div>
            <div className="mt-1 h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-accent)] rounded-full"
                animate={{ width: `${remainingSeconds > 0 ? ((timerTotal - remainingSeconds) / timerTotal) * 100 : 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className="p-3 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] disabled:opacity-30"
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="p-5 rounded-full bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30 active:scale-95 transition-transform"
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>

            <button
              onClick={goNext}
              disabled={currentStep === steps.length - 1}
              className="p-3 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] disabled:opacity-30"
            >
              <SkipForward size={22} />
            </button>
          </div>

          <button
            onClick={resetTimer}
            className="w-full mt-3 py-2 text-xs text-[var(--color-text-tertiary)]"
          >
            Reiniciar temporizador
          </button>
        </div>
      )}
    </div>
  )
}
