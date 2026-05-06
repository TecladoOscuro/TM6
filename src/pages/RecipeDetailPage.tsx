import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, ChefHat, Users, Heart, Bookmark, ShoppingCart, Play, Thermometer, Gauge, Timer, Info } from 'lucide-react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { DIFFICULTY_LABELS, CATEGORY_ICONS } from '@/types/recipe'

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

  useEffect(() => { if (recipes.length === 0) init() }, [])

  const recipe = id ? getRecipe(id) : undefined

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b safe-top">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="font-semibold truncate flex-1">{recipe.title}</h1>
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(recipe.id)}>
            <Heart size={22} className={recipe.isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toggleMakeLater(recipe.id)}>
            <Bookmark size={22} className={recipe.isMakeLater ? 'fill-amber-500 text-amber-500' : ''} />
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock size={14} />{timeStr(recipe.totalTime)}</span>
          <span className="flex items-center gap-1"><ChefHat size={14} />{DIFFICULTY_LABELS[recipe.difficulty]}</span>
          <span className="flex items-center gap-1"><Users size={14} />{recipe.servings}</span>
          <span className="text-lg">{CATEGORY_ICONS[recipe.category]}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{recipe.description}</p>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {recipe.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag.replace(/_/g, ' ')}</Badge>
            ))}
          </div>
        )}

        {recipe.utensils.length > 0 && (
          <Card className="p-3 mb-5 flex gap-2">
            <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium mb-1">Utensilios necesarios</p>
              <div className="flex flex-wrap gap-1.5">
                {recipe.utensils.map(u => (
                  <Badge key={u} variant="outline">{u}</Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-2 mb-6">
          <Button variant="outline" className="flex-1" onClick={() => addToShoppingList(recipe.id)}>
            <ShoppingCart size={18} className="mr-2" /> Añadir a la compra
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/cook/${recipe.id}`)}>
            <Play size={18} className="mr-2" /> Cocinar
          </Button>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Ingredientes</h2>
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
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group}</p>
                )}
                <ul className="space-y-1.5">
                  {ings.map((ing, i) => (
                    <li key={i} className="flex items-center justify-between py-2 px-3 bg-muted rounded-xl">
                      <span className="text-sm">{ing.name}{ing.optional ? <span className="text-[10px] text-muted-foreground italic ml-1">(opcional)</span> : ''}</span>
                      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap ml-2">
                        {ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          })()}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Elaboración</h2>
          <div className="space-y-3">
            {recipe.steps.map((step) => (
              <div key={step.stepNumber} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{step.stepNumber}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{step.instruction}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {step.temperature !== undefined && (
                      <Badge variant="destructive" className="text-[10px] h-auto py-0.5 px-1.5">
                        <Thermometer size={10} className="mr-1" />
                        {step.temperature === 'varoma' ? 'Varoma' : `${step.temperature}°C`}
                      </Badge>
                    )}
                    {step.speed !== undefined && (
                      <Badge variant="default" className="text-[10px] h-auto py-0.5 px-1.5">
                        <Gauge size={10} className="mr-1" />
                        Vel {step.speed}
                      </Badge>
                    )}
                    {step.time > 0 && (
                      <Badge variant="secondary" className="text-[10px] h-auto py-0.5 px-1.5">
                        <Timer size={10} className="mr-1" />
                        {step.time < 1 ? `${Math.round(step.time * 60)}s` : step.time < 60 ? `${step.time} min` : `${Math.floor(step.time / 60)}h`}
                      </Badge>
                    )}
                    {step.reverse && <Badge variant="outline" className="text-[10px] h-auto py-0.5 px-1.5">↩ Giro inv</Badge>}
                    {step.accessory && <Badge variant="outline" className="text-[10px] h-auto py-0.5 px-1.5">⚙ {step.accessory}</Badge>}
                  </div>
                  {step.note && <p className="mt-1 text-xs text-muted-foreground italic">{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {recipe.nutrition && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-2">Por ración</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[['kcal', recipe.nutrition.kcal], ['prot', `${recipe.nutrition.protein}g`], ['carbs', `${recipe.nutrition.carbs}g`], ['grasas', `${recipe.nutrition.fat}g`], ['fibra', `${recipe.nutrition.fiber}g`]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-lg font-bold">{val}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
