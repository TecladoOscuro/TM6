import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Thermometer, Gauge, Timer } from 'lucide-react'
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

  useEffect(() => {
    let wakeLock: any = null
    if ('wakeLock' in navigator) (navigator as any).wakeLock.request('screen').then((w: any) => { wakeLock = w }).catch(() => {})
    return () => { wakeLock?.release() }
  }, [])

  if (!recipe) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground animate-pulse">Cargando...</p></div>

  const steps = recipe.steps
  const step = steps[currentStep]

  const goNext = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1) }
  const goPrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) }

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
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= currentStep ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">{step.stepNumber}</span>
            </div>

            <p className="text-xl leading-relaxed max-w-md text-foreground">{step.instruction}</p>

            <div className="flex flex-wrap justify-center gap-1.5 mt-6">
              {step.temperature !== undefined && (
                <Badge variant="destructive" className="text-xs h-auto py-1 px-2">
                  <Thermometer size={12} className="mr-1" />
                  {step.temperature === 'varoma' ? 'Varoma' : `${step.temperature}°C`}
                </Badge>
              )}
              {step.speed !== undefined && (
                <Badge variant="default" className="text-xs h-auto py-1 px-2">
                  <Gauge size={12} className="mr-1" />
                  Velocidad {step.speed}
                </Badge>
              )}
              {step.time > 0 && (
                <Badge variant="secondary" className="text-xs h-auto py-1 px-2">
                  <Timer size={12} className="mr-1" />
                  {step.time < 1 ? `${Math.round(step.time * 60)}s` : step.time < 60 ? `${step.time} min` : `${Math.floor(step.time / 60)}h`}
                </Badge>
              )}
              {step.reverse && (
                <Badge variant="outline" className="text-xs h-auto py-1 px-2">↩ Giro inverso</Badge>
              )}
              {step.accessory && (
                <Badge variant="outline" className="text-xs h-auto py-1 px-2">⚙ {step.accessory}</Badge>
              )}
            </div>

            {step.note && (
              <p className="mt-4 text-sm text-muted-foreground italic">{step.note}</p>
            )}

            {steps.length > 1 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : i === currentStep
                        ? 'bg-primary/20 text-primary ring-1 ring-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < currentStep ? <CheckCircle size={14} /> : s.stepNumber}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={goPrev} disabled={currentStep === 0} className="flex-1">
            <ChevronLeft size={18} className="mr-1" /> Anterior
          </Button>
          <Button onClick={goNext} disabled={currentStep === steps.length - 1} className="flex-1">
            Siguiente <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
        {currentStep === steps.length - 1 && (
          <p className="text-center text-sm font-medium text-primary mt-3">¡Receta completada!</p>
        )}
      </div>
    </div>
  )
}
