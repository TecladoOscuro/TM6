import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, GripVertical, CheckCircle } from 'lucide-react'
import { useRecipeStore } from '../stores/recipeStore'
import type { Recipe, Ingredient, MT6Step, Category, Difficulty } from '../types/recipe'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../types/recipe'

type WizardStep = 'info' | 'ingredients' | 'steps' | 'review'

export default function AddRecipePage() {
  const navigate = useNavigate()
  const { addRecipe } = useRecipeStore()
  const [step, setStep] = useState<WizardStep>('info')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('cremas_sopas')
  const [difficulty, setDifficulty] = useState<Difficulty>('fácil')
  const [prepTime, setPrepTime] = useState(10)
  const [cookTime, setCookTime] = useState(20)
  const [servings, setServings] = useState(4)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: null, unit: 'g' }
  ])
  const [steps, setSteps] = useState<MT6Step[]>([
    { stepNumber: 1, instruction: '', temperature: undefined, speed: undefined, time: 5 }
  ])

  const totalTime = prepTime + cookTime

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: null, unit: 'g' }])
  }

  const updateIngredient = (index: number, field: Partial<Ingredient>) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], ...field }
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '', temperature: undefined, speed: undefined, time: 5 }])
  }

  const updateStep = (index: number, field: Partial<MT6Step>) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], ...field }
    setSteps(updated)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 }))
      setSteps(updated)
    }
  }

  const handleSubmit = () => {
    const recipe: Recipe = {
      id: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now(),
      title,
      description: description || `${title} - receta casera para Thermomix MT6.`,
      category,
      difficulty,
      totalTime,
      prepTime,
      cookTime,
      servings,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.instruction.trim()).map((s, i) => ({ ...s, stepNumber: i + 1 })),
      tags: [],
      utensils: [],
      source: 'user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addRecipe(recipe)
    navigate('/settings')
  }

  const canNext = () => {
    switch (step) {
      case 'info': return title.trim().length > 0
      case 'ingredients': return ingredients.some(i => i.name.trim())
      case 'steps': return steps.some(s => s.instruction.trim())
      case 'review': return true
      default: return false
    }
  }

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-[var(--color-border)] safe-top">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => step === 'info' ? (window.history.length > 1 ? navigate(-1) : navigate('/')) : setStep(step === 'ingredients' ? 'info' : step === 'steps' ? 'ingredients' : 'steps')} className="p-1 -ml-1">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-semibold text-[var(--color-text)] flex-1">Nueva receta</h1>
          <span className="text-xs text-[var(--color-text-tertiary)]">Paso {['info', 'ingredients', 'steps', 'review'].indexOf(step) + 1}/4</span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-4 pb-2">
          {(['info', 'ingredients', 'steps', 'review'] as WizardStep[]).map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${
                ['info', 'ingredients', 'steps', 'review'].indexOf(s) <= ['info', 'ingredients', 'steps', 'review'].indexOf(step)
                  ? 'bg-[var(--color-accent)]'
                  : 'bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1: Basic Info */}
            {step === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Título</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Nombre de la receta"
                    className="w-full h-11 px-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Descripción</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Breve descripción de la receta..."
                    rows={2}
                    className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Categoría</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as Category)}
                      className="w-full h-11 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none"
                    >
                      {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Dificultad</label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value as Difficulty)}
                      className="w-full h-11 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none"
                    >
                      {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Preparación (min)</label>
                    <input type="number" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))} min={1} className="w-full h-11 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Cocción (min)</label>
                    <input type="number" value={cookTime} onChange={e => setCookTime(Number(e.target.value))} min={1} className="w-full h-11 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Raciones</label>
                    <input type="number" value={servings} onChange={e => setServings(Number(e.target.value))} min={1} className="w-full h-11 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]" />
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-tertiary)]">Tiempo total: {totalTime} min</p>
              </div>
            )}

            {/* STEP 2: Ingredients */}
            {step === 'ingredients' && (
              <div className="space-y-3">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-full space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={ing.name}
                          onChange={e => updateIngredient(i, { name: e.target.value })}
                          placeholder="Nombre del ingrediente"
                          className="flex-1 h-10 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <button onClick={() => removeIngredient(i)} className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={ing.quantity ?? ''}
                          onChange={e => updateIngredient(i, { quantity: e.target.value ? Number(e.target.value) : null })}
                          placeholder="Cantidad"
                          className="w-24 h-10 px-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <select
                          value={ing.unit}
                          onChange={e => updateIngredient(i, { unit: e.target.value })}
                          className="flex-1 h-10 px-2 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm outline-none"
                        >
                          {['g', 'ml', 'unidad', 'diente', 'cucharada', 'cucharadita', 'hoja', 'al gusto', 'pizca'].map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addIngredient} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all">
                  <Plus size={18} /> Añadir ingrediente
                </button>
              </div>
            )}

            {/* STEP 3: Steps */}
            {step === 'steps' && (
              <div className="space-y-3">
                {steps.map((s, i) => (
                  <div key={i} className="p-4 bg-[var(--color-surface-alt)] rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[var(--color-accent)]">{s.stepNumber}</span>
                      </div>
                      <button onClick={() => removeStep(i)} className="ml-auto p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea
                      value={s.instruction}
                      onChange={e => updateStep(i, { instruction: e.target.value })}
                      placeholder="Instrucción del paso..."
                      rows={2}
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)] resize-none"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[var(--color-text-tertiary)] mb-1 block">Temperatura</label>
                        <select
                          value={s.temperature ?? ''}
                          onChange={e => updateStep(i, { temperature: e.target.value ? (e.target.value === 'varoma' ? 'varoma' as const : Number(e.target.value)) : undefined })}
                          className="w-full h-9 px-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs outline-none"
                        >
                          <option value="">Ninguna</option>
                          <option value="varoma">Varoma</option>
                          {[37, 50, 60, 70, 80, 90, 100, 120].map(t => (
                            <option key={t} value={t}>{t}°C</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--color-text-tertiary)] mb-1 block">Velocidad</label>
                        <select
                          value={s.speed ?? ''}
                          onChange={e => updateStep(i, { speed: e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value as any : Number(e.target.value)) : undefined })}
                          className="w-full h-9 px-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs outline-none"
                        >
                          <option value="">Ninguna</option>
                          <option value="cuchara">Cuchara</option>
                          <option value="espiga">Espiga</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[var(--color-text-tertiary)] mb-1 block">Tiempo (min)</label>
                        <input
                          type="number"
                          value={s.time}
                          onChange={e => updateStep(i, { time: Number(e.target.value) })}
                          min={0}
                          step={0.5}
                          className="w-full h-9 px-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs outline-none focus:border-[var(--color-accent)]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addStep} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all">
                  <Plus size={18} /> Añadir paso
                </button>
              </div>
            )}

            {/* STEP 4: Review */}
            {step === 'review' && (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--color-surface-alt)] rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                    <CheckCircle size={18} />
                    <span className="font-semibold text-[var(--color-text)]">Revisa tu receta</span>
                  </div>

                  <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>

                  <div className="flex gap-3 mt-3 text-xs text-[var(--color-text-secondary)]">
                    <span>{CATEGORY_LABELS[category]}</span>
                    <span>•</span>
                    <span>{DIFFICULTY_LABELS[difficulty]}</span>
                    <span>•</span>
                    <span>{totalTime} min</span>
                    <span>•</span>
                    <span>{servings} raciones</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--color-surface-alt)] rounded-2xl">
                  <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">{ingredients.length} ingredientes</h3>
                  <ul className="space-y-1">
                    {ingredients.filter(i => i.name.trim()).map((ing, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] flex justify-between">
                        <span>{ing.name}</span>
                        <span>{ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[var(--color-surface-alt)] rounded-2xl">
                  <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">{steps.filter(s => s.instruction.trim()).length} pasos</h3>
                  <ol className="space-y-2">
                    {steps.filter(s => s.instruction.trim()).map((s, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)]">
                        <span className="font-medium text-[var(--color-text)]">{i + 1}.</span> {s.instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next/Submit button */}
        <div className="mt-6">
          {step !== 'review' ? (
            <button
              onClick={() => setStep(step === 'info' ? 'ingredients' : step === 'ingredients' ? 'steps' : 'review')}
              disabled={!canNext()}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white rounded-2xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[var(--color-accent)]/20"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white rounded-2xl text-sm font-semibold active:scale-[0.98] transition-all shadow-lg shadow-[var(--color-accent)]/20"
            >
              Guardar receta
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
