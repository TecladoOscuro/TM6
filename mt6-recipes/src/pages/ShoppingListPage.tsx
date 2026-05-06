import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Check } from 'lucide-react'
import { useShoppingStore } from '../stores/shoppingStore'

export default function ShoppingListPage() {
  const { items, init, loading, toggleItem, removeItem, clearChecked } = useShoppingStore()

  useEffect(() => {
    init()
  }, [])

  const pending = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)
  const all = [...pending, ...checked]

  return (
    <div className="min-h-full px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Lista de la compra</h1>
        {checked.length > 0 && (
          <button onClick={clearChecked} className="flex items-center gap-1 text-xs font-medium text-[var(--color-danger)]">
            <Trash2 size={14} />
            Limpiar
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-[var(--color-surface-alt)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : all.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-lg font-medium text-[var(--color-text-secondary)]">Lista vacía</p>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Añade recetas desde su detalle</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {all.map((item) => (
            <motion.div
              key={item.id}
              layout
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                item.checked
                  ? 'bg-[var(--color-surface-alt)]/50 border-[var(--color-border)]/50'
                  : 'bg-[var(--color-surface-alt)] border-[var(--color-border)]'
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.checked
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {item.checked && <Check size={14} className="text-white" strokeWidth={3} />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${item.checked ? 'line-through text-[var(--color-text-tertiary)]' : 'text-[var(--color-text)]'}`}>
                  {item.name}
                </p>
                {item.quantity !== null && (
                  <p className={`text-xs ${item.checked ? 'text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {item.quantity} {item.unit}
                  </p>
                )}
              </div>

              <button onClick={() => removeItem(item.id)} className="flex-shrink-0 p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors">
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}

          {checked.length > 0 && (
            <p className="text-xs text-[var(--color-text-tertiary)] text-center pt-2">
              {checked.length} {checked.length === 1 ? 'marcado' : 'marcados'} de {all.length}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
