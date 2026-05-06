import { useEffect, useState } from 'react'
import { useRecipeStore } from '../stores/recipeStore'
import SearchBar from '../components/filters/SearchBar'
import FilterPanel from '../components/filters/FilterPanel'
import RecipeCard from '../components/recipes/RecipeCard'

export default function SearchPage() {
  const { filtered, init, filter, setFilter, resetFilters, loading } = useRecipeStore()
  const [localQuery, setLocalQuery] = useState(filter.query)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter({ query: localQuery })
    }, 250)
    return () => clearTimeout(timeout)
  }, [localQuery])

  return (
    <div className="min-h-full px-4 pt-4">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Buscar</h1>

      <div className="space-y-3">
        <SearchBar value={localQuery} onChange={setLocalQuery} autoFocus />
        <FilterPanel filter={filter} onChange={setFilter} onReset={resetFilters} />
      </div>

      <div className="mt-4">
        <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-[var(--color-surface-alt)] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, 100).map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-[var(--color-text-secondary)]">Sin resultados</p>
                <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Prueba con otros filtros</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
