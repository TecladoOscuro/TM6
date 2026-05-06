import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Check } from 'lucide-react'
import { useShoppingStore } from '@/stores/shoppingStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function ShoppingListPage() {
  const { items, init, loading, toggleItem, removeItem, clearChecked } = useShoppingStore()
  useEffect(() => { init() }, [])

  const pending = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)
  const all = [...pending, ...checked]

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Lista de la compra</h1>
        {checked.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChecked} className="text-destructive">
            <Trash2 size={14} className="mr-1" /> Limpiar
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : all.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-lg font-medium text-muted-foreground">Lista vacía</p>
          <p className="text-sm text-muted-foreground mt-1">Añade recetas desde su detalle</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {all.map(item => (
            <motion.div key={item.id} layout className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${item.checked ? 'bg-muted/50 border-border/50' : 'bg-muted'}`}>
              <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${item.checked ? 'line-through text-muted-foreground' : ''}`}>{item.name}</p>
                {item.quantity !== null && (
                  <p className={`text-xs ${item.checked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.quantity} {item.unit}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </Button>
            </motion.div>
          ))}
          {checked.length > 0 && (
            <p className="text-xs text-muted-foreground text-center pt-2">{checked.length} de {all.length}</p>
          )}
        </div>
      )}
    </div>
  )
}
