import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from '../components/recipes/RecipeCard'
import { CATEGORY_ICONS, CATEGORY_LABELS, type Category } from '../types/recipe'

export default function HomePage() {
  const { recipes, filtered, init, loading, setFilter } = useRecipeStore()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    if (recipes.length === 0) init()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setFilter({ category: selectedCategory })
    } else {
      setFilter({ category: null })
    }
  }, [selectedCategory])

  const displayRecipes = selectedCategory ? filtered : recipes
  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][]

  return (
    <div className="min-h-full px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">MT6 Recetas</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{recipes.length.toLocaleString('es')} recetas</p>
        </div>
        <Sparkles size={22} className="text-[var(--color-accent)]" />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
            !selectedCategory ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
          }`}
        >
          <span className="text-lg">🏠</span>
          <span>Todas</span>
        </button>
        {categories.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
              selectedCategory === key ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
            }`}
          >
            <span className="text-lg">{CATEGORY_ICONS[key]}</span>
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {loading ? (
        <div className="space-y-3 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--color-surface-alt)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          {displayRecipes.slice(0, 50).map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
