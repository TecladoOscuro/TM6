import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, CheckCircle, Thermometer, Gauge, Timer } from 'lucide-react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function CookingModePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, getRecipe, init } = useRecipeStore()

  useEffect(() => { if (recipes.length === 0) init() }, [])

  const recipe = id ? getRecipe(id) : undefined
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let wakeLock: any = null
    if ('wakeLock' in navigator) (navigator as any).wakeLock.request('screen').then((w: any) => { wakeLock = w }).catch(() => {})
    return () => { wakeLock?.release() }
  }, [])

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [])

  if (!recipe) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground animate-pulse">Cargando...</p></div>

  const steps = recipe.steps
  const step = steps[currentStep]

  const startTimer = () => {
    if (remainingSeconds === 0 && step) setRemainingSeconds(Math.round(step.time * 60))
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setIsRunning(false)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('TM6 Recetas', { body: `Paso ${step.stepNumber} completado` })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => { setIsRunning(false); if (timerRef.current) clearInterval(timerRef.current) }
  const resetTimer = () => { pauseTimer(); setRemainingSeconds(Math.round(step.time * 60)) }
  const goNext = () => { pauseTimer(); if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); setRemainingSeconds(0) } }
  const goPrev = () => { pauseTimer(); if (currentStep > 0) { setCurrentStep(currentStep - 1); setRemainingSeconds(0) } }
  const formatTime = (secs: number) => { const m = Math.floor(secs / 60); const s = secs % 60; return `${m}:${s.toString().padStart(2, '0')}` }
  const timerTotal = Math.round(step.time * 60)

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col safe-top safe-bottom">
      <div className="flex items-center gap-3 px-4 h-14 border-b">
        <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}>
          <ArrowLeft size={22} />
        </Button>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold truncate">{recipe.title}</p>
          <p className="text-xs text-muted-foreground">Paso {currentStep + 1} de {steps.length}</p>
        </div>
      </div>

      <div className="flex gap-1 px-4 py-2">
        {steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= currentStep ? 'bg-primary' : 'bg-border'}`} />)}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {steps.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => { pauseTimer(); setCurrentStep(i); setRemainingSeconds(0) }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${i === currentStep ? 'border-primary bg-primary/5 shadow-sm' : i < currentStep ? 'border-border bg-muted/50' : 'border-border bg-muted'}`}
              animate={i === currentStep ? { scale: [1, 1.01, 1] } : {}}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${i < currentStep ? 'bg-primary text-primary-foreground' : i === currentStep ? 'bg-primary/20 text-primary' : 'bg-border text-muted-foreground'}`}>
                  {i < currentStep ? <CheckCircle size={18} /> : <span className="text-sm font-bold">{s.stepNumber}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${i < currentStep ? 'text-muted-foreground' : ''}`}>{s.instruction}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.temperature !== undefined && <Badge variant="destructive" className="text-[10px] h-auto py-0.5 px-1.5"><Thermometer size={10} className="mr-1" />{s.temperature === 'varoma' ? 'Varoma' : `${s.temperature}°C`}</Badge>}
                    {s.speed !== undefined && <Badge variant="default" className="text-[10px] h-auto py-0.5 px-1.5"><Gauge size={10} className="mr-1" />Vel {s.speed}</Badge>}
                    {s.time > 0 && <Badge variant="secondary" className="text-[10px] h-auto py-0.5 px-1.5"><Timer size={10} className="mr-1" />{s.time < 1 ? `${Math.round(s.time * 60)}s` : `${s.time} min`}</Badge>}
                    {s.reverse && <Badge variant="outline" className="text-[10px] h-auto py-0.5 px-1.5">↩ Giro inv</Badge>}
                    {s.accessory && <Badge variant="outline" className="text-[10px] h-auto py-0.5 px-1.5">⚙ {s.accessory}</Badge>}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {step.time > 0 && (
        <div className="border-t px-4 py-4">
          <div className="text-center mb-4">
            <motion.div key={`${currentStep}-${remainingSeconds}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-5xl font-bold tracking-tight">
              {remainingSeconds > 0 ? formatTime(remainingSeconds) : formatTime(timerTotal)}
            </motion.div>
            <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${remainingSeconds > 0 ? ((timerTotal - remainingSeconds) / timerTotal) * 100 : 0}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" size="icon" onClick={goPrev} disabled={currentStep === 0} className="rounded-full"><SkipBack size={22} /></Button>
            <Button size="icon" onClick={isRunning ? pauseTimer : startTimer} className="p-5 rounded-full h-14 w-14 shadow-lg">
              {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </Button>
            <Button variant="secondary" size="icon" onClick={goNext} disabled={currentStep === steps.length - 1} className="rounded-full"><SkipForward size={22} /></Button>
          </div>

          <Button variant="ghost" size="sm" className="w-full mt-3 text-xs" onClick={resetTimer}>Reiniciar temporizador</Button>
        </div>
      )}
    </div>
  )
}
