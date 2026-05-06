import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ChefHat, Users, Heart, Bookmark, ShoppingCart, Play, Thermometer, Gauge, Timer, Info } from 'lucide-react'
import { useRecipeStore } from '../stores/recipeStore'
import { DIFFICULTY_LABELS, CATEGORY_ICONS } from '../types/recipe'

function timeStr(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecipe, toggleFavorite, toggleMakeLater, addToShoppingList, recipes, init } = useRecipeStore()

  useEffect(() => {
    if (recipes.length === 0) {
      init()
    }
  }, [])

  const recipe = id ? getRecipe(id) : undefined

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-text-tertiary)]">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-[var(--color-border)] safe-top">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="p-1 -ml-1 text-[var(--color-text)]">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-semibold text-[var(--color-text)] truncate flex-1">{recipe.title}</h1>
          <button onClick={() => toggleFavorite(recipe.id)} className="p-1">
            <Heart size={22} className={recipe.isFavorite ? 'fill-[var(--color-danger)] text-[var(--color-danger)]' : 'text-[var(--color-text-secondary)]'} />
          </button>
          <button onClick={() => toggleMakeLater(recipe.id)} className="p-1">
            <Bookmark size={22} className={recipe.isMakeLater ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--color-text-secondary)]'} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Info bar */}
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
          <span className="flex items-center gap-1"><Clock size={14} />{timeStr(recipe.totalTime)}</span>
          <span className="flex items-center gap-1"><ChefHat size={14} />{DIFFICULTY_LABELS[recipe.difficulty]}</span>
          <span className="flex items-center gap-1"><Users size={14} />{recipe.servings} {recipe.servings === 1 ? 'ración' : 'raciones'}</span>
          <span className="text-lg">{CATEGORY_ICONS[recipe.category]}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">{recipe.description}</p>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {recipe.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Utensils */}
        {recipe.utensils.length > 0 && (
          <div className="flex gap-2 mb-5 p-3 bg-[var(--color-surface-alt)] rounded-xl">
            <Info size={16} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-[var(--color-text)] mb-1">Utensilios necesarios</p>
              <div className="flex flex-wrap gap-1.5">
                {recipe.utensils.map(u => (
                  <span key={u} className="px-2 py-0.5 text-[11px] bg-[var(--color-surface)] rounded-full text-[var(--color-text-secondary)]">{u}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => addToShoppingList(recipe.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl text-sm font-medium text-[var(--color-text)] active:scale-[0.98] transition-transform"
          >
            <ShoppingCart size={18} />
            Añadir a la compra
          </button>
          <button
            onClick={() => navigate(`/cook/${recipe.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-accent)] rounded-2xl text-sm font-medium text-white active:scale-[0.98] transition-transform shadow-lg shadow-[var(--color-accent)]/20"
          >
            <Play size={18} />
            Cocinar
          </button>
        </div>

        {/* Ingredients */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-3">Ingredientes</h2>

          {/* Grouped ingredients */}
          {(() => {
            const groups = new Map<string, typeof recipe.ingredients>()
            for (const ing of recipe.ingredients) {
              const g = ing.group || ''
              if (!groups.has(g)) groups.set(g, [])
              groups.get(g)!.push(ing)
            }
            return [...groups.entries()].map(([group, ings]) => (
              <div key={group} className="mb-3">
                {group && groups.size > 1 && (
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">{group}</p>
                )}
                <ul className="space-y-2">
                  {ings.map((ing, i) => (
                    <li key={i} className="flex items-center justify-between py-2 px-3 bg-[var(--color-surface-alt)] rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-text-secondary)]">•</span>
                        <span className="text-sm text-[var(--color-text)]">{ing.name}</span>
                        {ing.optional && <span className="text-[10px] text-[var(--color-text-tertiary)] italic">(opcional)</span>}
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-secondary)] whitespace-nowrap ml-2">
                        {ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          })()}
        </section>

        {/* Steps */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-3">Elaboración</h2>
          <div className="space-y-3">
            {recipe.steps.map((step) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.stepNumber * 0.05 }}
                className="flex gap-3"
              >
                {/* Step number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--color-accent)]">{step.stepNumber}</span>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">{step.instruction}</p>

                  {/* TM6 settings */}
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {step.temperature !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-danger)]/10 rounded-lg text-[11px] font-medium text-[var(--color-danger)]">
                        <Thermometer size={12} />
                        {step.temperature === 'varoma' ? 'Varoma' : `${step.temperature}°C`}
                      </span>
                    )}
                    {step.speed !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent)]/10 rounded-lg text-[11px] font-medium text-[var(--color-accent)]">
                        <Gauge size={12} />
                        Vel {typeof step.speed === 'number' ? step.speed : step.speed}
                      </span>
                    )}
                    {step.time > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-warning)]/10 rounded-lg text-[11px] font-medium text-[var(--color-warning)]">
                        <Timer size={12} />
                        {step.time < 1 ? `${Math.round(step.time * 60)}s` : step.time < 60 ? `${step.time} min` : `${Math.floor(step.time / 60)}h${step.time % 60 > 0 ? ` ${step.time % 60}min` : ''}`}
                      </span>
                    )}
                    {step.reverse && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-[11px] font-medium text-purple-600 dark:text-purple-400">
                        ↩ Giro inverso
                      </span>
                    )}
                    {step.accessory && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        ⚙ {step.accessory}
                      </span>
                    )}
                  </div>

                  {step.note && (
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)] italic">{step.note}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Nutrition */}
        {recipe.nutrition && (
          <section className="p-4 bg-[var(--color-surface-alt)] rounded-2xl">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Información nutricional (por ración)</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-[var(--color-text)]">{recipe.nutrition.kcal}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">kcal</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-text)]">{recipe.nutrition.protein}g</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">proteínas</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-text)]">{recipe.nutrition.carbs}g</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">carbohidratos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-text)]">{recipe.nutrition.fat}g</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">grasas</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--color-text)]">{recipe.nutrition.fiber}g</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">fibra</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
