import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Card } from '@/components/ui/card'
import { Heart, Bookmark, Clock, ChefHat, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTY_LABELS } from '@/types/recipe'

function timeStr(m: number) { return m < 60 ? `${m}′` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}′` : ''}` }

export default function SavedPage() {
  const { recipes, init, loading } = useRecipeStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'favorites' | 'later'>('favorites')

  useEffect(() => { if (recipes.length === 0) init() }, [])

  const favorites = recipes.filter(r => r.isFavorite)
  const makeLater = recipes.filter(r => r.isMakeLater)
  const list = tab === 'favorites' ? favorites : makeLater

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">Guardados</h1>

      <div className="flex bg-muted rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('favorites')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'favorites' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <Heart size={16} className={tab === 'favorites' ? 'fill-red-500 text-red-500' : ''} />
          Me gusta <span className="text-xs opacity-60">({favorites.length})</span>
        </button>
        <button
          onClick={() => setTab('later')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'later' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          <Bookmark size={16} className={tab === 'later' ? 'fill-amber-500 text-amber-500' : ''} />
          Más tarde <span className="text-xs opacity-60">({makeLater.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">{tab === 'favorites' ? '❤️' : '🔖'}</p>
          <p className="text-lg font-medium text-muted-foreground">
            {tab === 'favorites' ? 'No tienes favoritos' : 'No hay recetas guardadas'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {tab === 'favorites' ? 'Toca el corazón en cualquier receta' : 'Toca el marcador en cualquier receta'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((recipe) => (
            <Card
              key={recipe.id}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0">
                  🧑‍🍳
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{recipe.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{timeStr(recipe.totalTime)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><ChefHat size={12} />{DIFFICULTY_LABELS[recipe.difficulty]}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground/30 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
