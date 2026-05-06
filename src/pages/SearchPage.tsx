import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, X, Clock, ChefHat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FilterState, Category } from '@/types/recipe'
import { CATEGORY_LABELS, DIFFICULTY_LABELS, ACCESSORY_LABELS } from '@/types/recipe'

function timeStr(m: number) { return m < 60 ? `${m}′` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}′` : ''}` }

export default function SearchPage() {
  const { filtered, init, filter, setFilter, resetFilters, loading } = useRecipeStore()
  const [localQuery, setLocalQuery] = useState(filter.query)
  const [filterOpen, setFilterOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { init() }, [])
  useEffect(() => {
    const t = setTimeout(() => setFilter({ query: localQuery }), 200)
    return () => clearTimeout(t)
  }, [localQuery])

  const FilterBody = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">Ordenar</label>
        <Select value={filter.sortBy} onValueChange={v => setFilter({ sortBy: v as FilterState['sortBy'] })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="time_asc">Tiempo ↑</SelectItem>
            <SelectItem value="time_desc">Tiempo ↓</SelectItem>
            <SelectItem value="title_asc">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Categoría</label>
        <div className="flex flex-wrap gap-1.5">
          {(['', ...Object.keys(CATEGORY_LABELS)] as string[]).map(k => (
            <Badge
              key={k || 'all'}
              variant={!k && !filter.category || filter.category === k ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter({ category: k ? k as Category : null })}
            >
              {k ? CATEGORY_LABELS[k as Category] : 'Todas'}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Dificultad</label>
        <div className="flex gap-1.5">
          {(['fácil', 'media', 'avanzada'] as const).map(d => (
            <Badge key={d} variant={filter.difficulty === d ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilter({ difficulty: filter.difficulty === d ? null : d })}>
              {DIFFICULTY_LABELS[d]}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Tiempo máximo</label>
        <div className="flex gap-1.5">
          {[15, 30, 60, 120].map(t => (
            <Badge key={t} variant={filter.maxTime === t ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilter({ maxTime: filter.maxTime === t ? null : t })}>
              {t < 60 ? `${t}′` : `${t / 60}h`}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Utensilios</label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(ACCESSORY_LABELS) as [string, string][]).map(([k, v]) => (
            <Badge key={k} variant={filter.utensils.includes(k as any) ? 'default' : 'outline'} className="cursor-pointer"
              onClick={() => setFilter({ utensils: filter.utensils.includes(k as any) ? filter.utensils.filter(u => u !== k) : [...filter.utensils, k as any] })}>
              {v}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Dieta</label>
        <div className="flex flex-wrap gap-1.5">
          {['vegano', 'vegetariano', 'sin_gluten', 'sin_lactosa', 'fit', 'rapida', 'economica'].map(t => (
            <Badge key={t} variant={filter.tags.includes(t as any) ? 'default' : 'outline'} className="cursor-pointer"
              onClick={() => setFilter({ tags: filter.tags.includes(t as any) ? filter.tags.filter(tag => tag !== t) : [...filter.tags, t as any] })}>
              {t.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>Limpiar</Button>
        <Button className="flex-1" onClick={() => setFilterOpen(false)}>Aplicar</Button>
      </div>
    </div>
  )

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">TM6 Recetas</h1>
        <Badge variant="secondary" className="rounded-full">{filtered.length.toLocaleString()}</Badge>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input value={localQuery} onChange={e => setLocalQuery(e.target.value)} placeholder="Buscar recetas..." className="pl-10 pr-4 border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20" />
          {localQuery && (
            <button onClick={() => setLocalQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <SlidersHorizontal size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filtros</DialogTitle>
            </DialogHeader>
            <FilterBody />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 150).map((recipe, i) => (
            <Card
              key={recipe.id}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform border-l-2 border-l-transparent hover:border-l-primary"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0">
                  🧑‍🍳
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{recipe.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{timeStr(recipe.totalTime)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><ChefHat size={12} />{DIFFICULTY_LABELS[recipe.difficulty]}</span>
                    <span className="text-xs text-muted-foreground">{recipe.servings} rac</span>
                  </div>
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0 h-auto">{t.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-muted-foreground">Sin resultados</p>
              <p className="text-sm text-muted-foreground mt-1">Prueba con otros filtros</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
