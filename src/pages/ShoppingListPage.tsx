import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Check, ChevronDown, Search, ShoppingCart } from 'lucide-react'
import { useShoppingStore } from '@/stores/shoppingStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export default function ShoppingListPage() {
  const { items, init, loading, toggleItem, removeItem, removeRecipeItems, clearChecked } = useShoppingStore()
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  useEffect(() => { init() }, [])

  const filtered = search
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.recipeTitle?.toLowerCase().includes(search.toLowerCase()))
    : items

  const grouped = new Map<string, typeof filtered>()
  for (const item of filtered) {
    const key = item.recipeTitle || 'Sin receta'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const pending = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  if (loading) return <div className="px-4 pt-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}</div>

  if (items.length === 0) {
    return (
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Lista de la compra</h1>
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} className="text-primary" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">Lista vacía</p>
          <p className="text-sm text-muted-foreground mt-1">Añade ingredientes desde cualquier receta</p>
        </div>
      </div>
    )
  }

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

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrar ingredientes..." className="pl-9 text-sm" />
      </div>

      <div className="space-y-3">
        {[...grouped.entries()].map(([recipeTitle, recipeItems]) => {
          const recipeId = recipeItems[0]?.recipeId
          const doneCount = recipeItems.filter(i => i.checked).length
          const totalCount = recipeItems.length
          const isCollapsed = collapsed.has(recipeTitle)
          const allDone = doneCount === totalCount

          return (
            <motion.div
              key={recipeTitle}
              layout
              className={`rounded-2xl border overflow-hidden ${allDone ? 'opacity-60' : ''}`}
            >
              <button
                onClick={() => toggleCollapse(recipeTitle)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${allDone ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/30 text-primary'}`}>
                  {allDone ? <Check size={12} /> : doneCount}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold truncate">{recipeTitle}</p>
                  <p className="text-xs text-muted-foreground">{doneCount}/{totalCount} · {totalCount - doneCount} pend</p>
                </div>
                <div className="flex items-center gap-1">
                  {recipeId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={e => { e.stopPropagation(); removeRecipeItems(recipeId) }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                  <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y">
                      {recipeItems.map(item => (
                        <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${item.checked ? 'bg-muted/30' : ''}`}>
                          <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </p>
                            {item.quantity !== null && (
                              <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {checked.length > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-4 pb-4">{pending.length} pendientes · {checked.length} comprados</p>
      )}
    </div>
  )
}
