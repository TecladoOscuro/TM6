import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recipe, Ingredient, TM6Step, Category, Difficulty } from '@/types/recipe'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/types/recipe'

type WizardStep = 'info' | 'ingredients' | 'steps' | 'review'

export default function AddRecipePage() {
  const navigate = useNavigate()
  const { addRecipe } = useRecipeStore()
  const [step, setStep] = useState<WizardStep>('info')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('cremas_sopas')
  const [difficulty, setDifficulty] = useState<Difficulty>('fácil')
  const [prepTime, setPrepTime] = useState(10)
  const [cookTime, setCookTime] = useState(20)
  const [servings, setServings] = useState(4)
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: null, unit: 'g' }])
  const [steps, setSteps] = useState<TM6Step[]>([{ stepNumber: 1, instruction: '', temperature: undefined, speed: undefined, time: 5 }])

  const totalTime = prepTime + cookTime
  const stepOrder: WizardStep[] = ['info', 'ingredients', 'steps', 'review']
  const currentIndex = stepOrder.indexOf(step)

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: null, unit: 'g' }])
  const updateIngredient = (i: number, f: Partial<Ingredient>) => { const u = [...ingredients]; u[i] = { ...u[i], ...f }; setIngredients(u) }
  const removeIngredient = (i: number) => { if (ingredients.length > 1) setIngredients(ingredients.filter((_, j) => j !== i)) }
  const addStep = () => setSteps([...steps, { stepNumber: steps.length + 1, instruction: '', temperature: undefined, speed: undefined, time: 5 }])
  const updateStep = (i: number, f: Partial<TM6Step>) => { const u = [...steps]; u[i] = { ...u[i], ...f }; setSteps(u) }
  const removeStep = (i: number) => { if (steps.length > 1) { const u = steps.filter((_, j) => j !== i).map((s, j) => ({ ...s, stepNumber: j + 1 })); setSteps(u) } }

  const handleSubmit = () => {
    const recipe: Recipe = {
      id: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now(),
      title, category, difficulty, totalTime, prepTime, cookTime, servings,
      description: description || `${title} - receta casera para Thermomix TM6.`,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.instruction.trim()).map((s, i) => ({ ...s, stepNumber: i + 1 })),
      tags: [], utensils: [], source: 'user', createdAt: Date.now(), updatedAt: Date.now(),
    }
    addRecipe(recipe)
    navigate('/settings')
  }

  const canNext = () => {
    switch (step) {
      case 'info': return title.trim().length > 0
      case 'ingredients': return ingredients.some(i => i.name.trim())
      case 'steps': return steps.some(s => s.instruction.trim())
      default: return true
    }
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b safe-top">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => step === 'info' ? (window.history.length > 1 ? navigate(-1) : navigate('/settings')) : setStep(stepOrder[currentIndex - 1])}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="font-semibold flex-1">Nueva receta</h1>
          <span className="text-xs text-muted-foreground">Paso {currentIndex + 1}/4</span>
        </div>
        <div className="flex gap-1 px-4 pb-2">
          {stepOrder.map(s => <div key={s} className={`flex-1 h-1 rounded-full ${stepOrder.indexOf(s) <= currentIndex ? 'bg-primary' : 'bg-border'}`} />)}
        </div>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Título</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nombre de la receta" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Descripción</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descripción..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Categoría</label>
                    <Select value={category} onValueChange={v => setCategory(v as Category)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Dificultad</label>
                    <Select value={difficulty} onValueChange={v => setDifficulty(v as Difficulty)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-sm font-medium mb-1.5 block">Prep (min)</label><Input type="number" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))} min={1} /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Cocción (min)</label><Input type="number" value={cookTime} onChange={e => setCookTime(Number(e.target.value))} min={1} /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Raciones</label><Input type="number" value={servings} onChange={e => setServings(Number(e.target.value))} min={1} /></div>
                </div>
                <p className="text-xs text-muted-foreground">Tiempo total: {totalTime} min</p>
              </div>
            )}

            {step === 'ingredients' && (
              <div className="space-y-3">
                {ingredients.map((ing, i) => (
                  <Card key={i} className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <Input value={ing.name} onChange={e => updateIngredient(i, { name: e.target.value })} placeholder="Ingrediente" />
                      <Button variant="ghost" size="icon" onClick={() => removeIngredient(i)} className="text-muted-foreground hover:text-destructive"><Trash2 size={18} /></Button>
                    </div>
                    <div className="flex gap-2">
                      <Input type="number" value={ing.quantity ?? ''} onChange={e => updateIngredient(i, { quantity: e.target.value ? Number(e.target.value) : null })} placeholder="Cantidad" className="w-24" />
                      <Select value={ing.unit} onValueChange={v => updateIngredient(i, { unit: v || 'g' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['g', 'ml', 'unidad', 'diente', 'cucharada', 'cucharadita', 'hoja', 'al gusto', 'pizca'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full border-dashed" onClick={addIngredient}><Plus size={18} className="mr-2" />Añadir ingrediente</Button>
              </div>
            )}

            {step === 'steps' && (
              <div className="space-y-3">
                {steps.map((s, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-7 h-7 rounded-full flex items-center justify-center p-0">{s.stepNumber}</Badge>
                      <Button variant="ghost" size="icon" className="ml-auto" onClick={() => removeStep(i)}><Trash2 size={16} /></Button>
                    </div>
                    <Textarea value={s.instruction} onChange={e => updateStep(i, { instruction: e.target.value })} placeholder="Instrucción del paso..." rows={2} />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground mb-1 block">Temp</label>
                        <Select value={s.temperature?.toString() ?? ''} onValueChange={v => updateStep(i, { temperature: v ? (v === 'varoma' ? 'varoma' : Number(v)) : undefined })}>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Ninguna" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NING">Ninguna</SelectItem>
                            <SelectItem value="varoma">Varoma</SelectItem>
                            {[37, 50, 60, 70, 80, 90, 100, 120].map(t => <SelectItem key={t} value={t.toString()}>{t}°C</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground mb-1 block">Vel</label>
                        <Select value={s.speed?.toString() ?? ''} onValueChange={v => updateStep(i, { speed: v ? (isNaN(Number(v)) ? v as any : Number(v)) : undefined })}>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Ninguna" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NING">Ninguna</SelectItem>
                            <SelectItem value="cuchara">Cuchara</SelectItem>
                            <SelectItem value="espiga">Espiga</SelectItem>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground mb-1 block">Tiempo</label>
                        <Input type="number" value={s.time} onChange={e => updateStep(i, { time: Number(e.target.value) })} min={0} step={0.5} className="h-9 text-xs" />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full border-dashed" onClick={addStep}><Plus size={18} className="mr-2" />Añadir paso</Button>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{description || `${title} - receta casera`}</p>
                  <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                    <span>{CATEGORY_LABELS[category]}</span><span>•</span>
                    <span>{DIFFICULTY_LABELS[difficulty]}</span><span>•</span>
                    <span>{totalTime} min</span><span>•</span>
                    <span>{servings} rac</span>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-2">{ingredients.filter(i => i.name.trim()).length} ingredientes</h3>
                  <ul className="space-y-1">
                    {ingredients.filter(i => i.name.trim()).map((ing, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex justify-between"><span>{ing.name}</span><span>{ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}</span></li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-2">{steps.filter(s => s.instruction.trim()).length} pasos</h3>
                  <ol className="space-y-2">
                    {steps.filter(s => s.instruction.trim()).map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{i + 1}.</span> {s.instruction}</li>
                    ))}
                  </ol>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          {step !== 'review' ? (
            <Button className="w-full" onClick={() => setStep(stepOrder[currentIndex + 1])} disabled={!canNext()}>Siguiente</Button>
          ) : (
            <Button className="w-full" onClick={handleSubmit}>Guardar receta</Button>
          )}
        </div>
      </div>
    </div>
  )
}
