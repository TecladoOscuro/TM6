import { useEffect, useState } from 'react'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from '../components/recipes/RecipeCard'
import { Heart, Bookmark } from 'lucide-react'

type Tab = 'favorites' | 'later'

export default function SavedPage() {
  const { recipes, init, loading } = useRecipeStore()
  const [tab, setTab] = useState<Tab>('favorites')

  useEffect(() => {
    if (recipes.length === 0) init()
  }, [])

  const favorites = recipes.filter(r => r.isFavorite)
  const makeLater = recipes.filter(r => r.isMakeLater)

  return (
    <div className="min-h-full px-4 pt-4">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Guardados</h1>

      <div className="flex bg-[var(--color-surface-alt)] rounded-2xl p-1 mb-4">
        <button
          onClick={() => setTab('favorites')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'favorites' ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          <Heart size={16} className={tab === 'favorites' ? 'fill-[var(--color-accent)]' : ''} />
          Me gusta ({favorites.length})
        </button>
        <button
          onClick={() => setTab('later')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'later' ? 'bg-[var(--color-surface)] text-[var(--color-warning)] shadow-sm' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          <Bookmark size={16} className={tab === 'later' ? 'fill-[var(--color-warning)]' : ''} />
          Más tarde ({makeLater.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--color-surface-alt)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {(tab === 'favorites' ? favorites : makeLater).map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
          {(tab === 'favorites' ? favorites : makeLater).length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">{tab === 'favorites' ? '❤️' : '🔖'}</p>
              <p className="text-lg font-medium text-[var(--color-text-secondary)]">
                {tab === 'favorites' ? 'No hay favoritos aún' : 'No hay recetas para más tarde'}
              </p>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
                {tab === 'favorites' ? 'Toca el corazón en cualquier receta' : 'Toca el marcador en cualquier receta'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
