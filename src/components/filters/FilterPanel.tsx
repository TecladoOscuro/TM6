import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Filter, X } from 'lucide-react'
import type { FilterState, Category, Difficulty, DietTag, TM6Accessory } from '../../types/recipe'
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DIET_TAG_LABELS, ACCESSORY_LABELS } from '../../types/recipe'

interface FilterPanelProps {
  filter: FilterState
  onChange: (filter: Partial<FilterState>) => void
  onReset: () => void
}

const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'time_asc', label: 'Tiempo (menor a mayor)' },
  { value: 'time_desc', label: 'Tiempo (mayor a menor)' },
  { value: 'difficulty_asc', label: 'Dificultad (fácil primero)' },
  { value: 'difficulty_desc', label: 'Dificultad (difícil primero)' },
  { value: 'title_asc', label: 'A-Z' },
]

export default function FilterPanel({ filter, onChange, onReset }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [excludeInput, setExcludeInput] = useState('')
  const [includeInput, setIncludeInput] = useState('')

  const hasFilters = filter.query.trim() !== '' || filter.sortBy !== 'relevance' || filter.category || filter.difficulty || filter.maxTime || filter.includeIngredients.length > 0 || filter.excludeIngredients.length > 0 || filter.tags.length > 0 || filter.utensils.length > 0

  const addExclude = () => {
    if (excludeInput.trim() && !filter.excludeIngredients.includes(excludeInput.trim())) {
      onChange({ excludeIngredients: [...filter.excludeIngredients, excludeInput.trim()] })
      setExcludeInput('')
    }
  }

  const addInclude = () => {
    if (includeInput.trim() && !filter.includeIngredients.includes(includeInput.trim())) {
      onChange({ includeIngredients: [...filter.includeIngredients, includeInput.trim()] })
      setIncludeInput('')
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          hasFilters
            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
            : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
        }`}
      >
        <Filter size={16} />
        Filtros
        {hasFilters && <span className="bg-[var(--color-accent)] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">•</span>}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)] space-y-4">
              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Ordenar</label>
                <select
                  value={filter.sortBy}
                  onChange={e => onChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                  className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] outline-none"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Categoría</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onChange({ category: null })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      !filter.category ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    Todas
                  </button>
                  {(Object.entries(CATEGORY_LABELS) as [Category, string][]).slice(0, 12).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => onChange({ category: filter.category === k ? null : k })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filter.category === k ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Dificultad</label>
                <div className="flex gap-1.5">
                  {(Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => onChange({ difficulty: filter.difficulty === k ? null : k })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filter.difficulty === k ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max time */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Tiempo máximo</label>
                <div className="flex gap-1.5">
                  {[15, 30, 60, 120].map(t => (
                    <button
                      key={t}
                      onClick={() => onChange({ maxTime: filter.maxTime === t ? null : t })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filter.maxTime === t ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {t < 60 ? `${t}'` : `${t / 60}h`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include ingredients */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Incluir ingredientes</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={includeInput}
                    onChange={e => setIncludeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addInclude()}
                    placeholder="ej: pollo"
                    className="flex-1 h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  <button onClick={addInclude} className="px-3 h-10 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium">Añadir</button>
                </div>
                {filter.includeIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filter.includeIngredients.map(ing => (
                      <span key={ing} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-xs">
                        {ing}
                        <button onClick={() => onChange({ includeIngredients: filter.includeIngredients.filter(i => i !== ing) })}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Exclude ingredients */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Excluir ingredientes</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={excludeInput}
                    onChange={e => setExcludeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addExclude()}
                    placeholder="ej: gluten"
                    className="flex-1 h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  <button onClick={addExclude} className="px-3 h-10 bg-[var(--color-danger)] text-white rounded-xl text-sm font-medium">Excluir</button>
                </div>
                {filter.excludeIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filter.excludeIngredients.map(ing => (
                      <span key={ing} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-danger)]/10 text-[var(--color-danger)] rounded-full text-xs">
                        {ing}
                        <button onClick={() => onChange({ excludeIngredients: filter.excludeIngredients.filter(i => i !== ing) })}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Diet tags */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Dieta</label>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(DIET_TAG_LABELS) as [DietTag, string][]).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => onChange({ tags: filter.tags.includes(k) ? filter.tags.filter(t => t !== k) : [...filter.tags, k] })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        filter.tags.includes(k) ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utensils */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Utensilios TM6</label>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(ACCESSORY_LABELS) as [TM6Accessory, string][]).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => onChange({ utensils: filter.utensils.includes(k) ? filter.utensils.filter(u => u !== k) : [...filter.utensils, k] })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        filter.utensils.includes(k) ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {hasFilters && (
                <button onClick={onReset} className="w-full py-2 text-sm font-medium text-[var(--color-danger)]">
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
