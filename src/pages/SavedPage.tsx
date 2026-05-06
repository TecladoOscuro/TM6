import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Bookmark, Clock, ChefHat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTY_LABELS } from '@/types/recipe'

function timeStr(m: number) { return m < 60 ? `${m}′` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}′` : ''}` }

export default function SavedPage() {
  const { recipes, init, loading } = useRecipeStore()
  const navigate = useNavigate()

  useEffect(() => { if (recipes.length === 0) init() }, [])

  const favorites = recipes.filter(r => r.isFavorite)
  const makeLater = recipes.filter(r => r.isMakeLater)

  const RecipeItem = ({ recipe }: { recipe: typeof recipes[0] }) => (
    <Card className="p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">🧑‍🍳</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{recipe.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{timeStr(recipe.totalTime)}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><ChefHat size={12} />{DIFFICULTY_LABELS[recipe.difficulty]}</span>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">Guardados</h1>

      <Tabs defaultValue="favorites">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="favorites" className="flex-1 gap-2">
            <Heart size={16} /> Me gusta ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="later" className="flex-1 gap-2">
            <Bookmark size={16} /> Más tarde ({makeLater.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
          : favorites.length === 0 ? <Empty icon="❤️" msg="No hay favoritos" hint="Toca el corazón en cualquier receta" />
          : <div className="space-y-2">{favorites.map((r, i) => <RecipeItem key={r.id} recipe={r} />)}</div>}
        </TabsContent>

        <TabsContent value="later">
          {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
          : makeLater.length === 0 ? <Empty icon="🔖" msg="No hay para más tarde" hint="Toca el marcador en cualquier receta" />
          : <div className="space-y-2">{makeLater.map((r, i) => <RecipeItem key={r.id} recipe={r} />)}</div>}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Empty({ icon, msg, hint }: { icon: string; msg: string; hint: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-lg font-medium text-muted-foreground">{msg}</p>
      <p className="text-sm text-muted-foreground mt-1">{hint}</p>
    </div>
  )
}
