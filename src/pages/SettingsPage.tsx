import { Moon, Sun, Plus } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { mode, setTheme } = useThemeStore()
  const { recipes, init } = useRecipeStore()
  const navigate = useNavigate()

  useEffect(() => { if (recipes.length === 0) init() }, [])

  const userRecipes = recipes.filter(r => r.source === 'user')

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold mb-6">Ajustes</h1>

      <section className="mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tema</p>
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <Sun size={18} /> Claro
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <Moon size={18} /> Oscuro
          </button>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recetas</p>
        <Button className="w-full h-14 text-base gap-3" onClick={() => navigate('/add-recipe')}>
          <Plus size={22} /> Añadir nueva receta
        </Button>
        {userRecipes.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">{userRecipes.length} recetas creadas por ti</p>
        )}
      </section>
    </div>
  )
}
