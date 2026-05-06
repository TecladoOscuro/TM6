import { Moon, Sun, Monitor, Plus, Info, ExternalLink } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useRecipeStore } from '../stores/recipeStore'

export default function SettingsPage() {
  const { mode, setTheme } = useThemeStore()
  const { recipes, init } = useRecipeStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (recipes.length === 0) init()
  }, [])

  const userRecipes = recipes.filter(r => r.source === 'user')

  return (
    <div className="min-h-full px-4 pt-4">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Ajustes</h1>

      {/* Theme */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Tema</h2>
        <div className="flex bg-[var(--color-surface-alt)] rounded-2xl p-1.5">
          {[
            { value: 'light' as const, icon: Sun, label: 'Claro' },
            { value: 'dark' as const, icon: Moon, label: 'Oscuro' },
            { value: 'system' as const, icon: Monitor, label: 'Sistema' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === value ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-secondary)]'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* App info */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">App</h2>
        <div className="space-y-1">
          <button
            onClick={() => navigate('/add-recipe')}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-[var(--color-surface-alt)] rounded-2xl text-sm font-medium text-[var(--color-text)]"
          >
            <div className="flex items-center gap-3">
              <Plus size={20} className="text-[var(--color-accent)]" />
              <span>Añadir receta</span>
            </div>
            <span className="text-xs text-[var(--color-text-tertiary)]">{userRecipes.length} creadas</span>
          </button>

          <div className="flex items-center justify-between px-4 py-3.5 bg-[var(--color-surface-alt)] rounded-2xl">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm text-[var(--color-text)]">Total de recetas</span>
            </div>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">{recipes.length.toLocaleString('es')}</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3.5 bg-[var(--color-surface-alt)] rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm text-[var(--color-text)]">GitHub</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text-tertiary)]">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
