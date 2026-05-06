import { Moon, Sun, Monitor, Plus, Info, ExternalLink } from 'lucide-react'
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

      <section className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tema</p>
        <div className="flex bg-muted rounded-xl p-1.5">
          {[
            { value: 'light' as const, icon: Sun, label: 'Claro' },
            { value: 'dark' as const, icon: Moon, label: 'Oscuro' },
            { value: 'system' as const, icon: Monitor, label: 'Sistema' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === value ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">App</p>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-between h-14" onClick={() => navigate('/add-recipe')}>
            <span className="flex items-center gap-3"><Plus size={20} /> Añadir receta</span>
            <span className="text-xs text-muted-foreground">{userRecipes.length} creadas</span>
          </Button>
          <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-muted h-14">
            <span className="flex items-center gap-3"><Info size={20} /> Total de recetas</span>
            <span className="text-sm font-medium text-muted-foreground">{recipes.length.toLocaleString()}</span>
          </div>
          <a href="https://github.com/TecladoOscuro/TM6" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-muted h-14">
            <span className="flex items-center gap-3"><ExternalLink size={20} /> GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg>
          </a>
        </div>
      </section>
    </div>
  )
}
