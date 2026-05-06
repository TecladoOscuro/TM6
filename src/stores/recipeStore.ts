import { create } from 'zustand'
import type { Recipe, FilterState, Category } from '../types/recipe'
import { db } from '../db/database'
import { useShoppingStore } from './shoppingStore'

interface RecipeStore {
  recipes: Recipe[]
  filtered: Recipe[]
  filter: FilterState
  loading: boolean
  seeded: boolean

  init: () => Promise<void>
  setFilter: (filter: Partial<FilterState>) => void
  resetFilters: () => void
  applyFilters: () => void

  toggleFavorite: (recipeId: string) => Promise<void>
  toggleMakeLater: (recipeId: string) => Promise<void>
  addToShoppingList: (recipeId: string) => Promise<void>

  addRecipe: (recipe: Recipe) => Promise<void>
  updateRecipe: (recipe: Recipe) => Promise<void>
  deleteRecipe: (recipeId: string) => Promise<void>

  getRecipe: (id: string) => Recipe | undefined
  getFavorites: () => Recipe[]
  getMakeLater: () => Recipe[]
}

const defaultFilter: FilterState = {
  query: '',
  category: null,
  difficulty: null,
  maxTime: null,
  includeIngredients: [],
  excludeIngredients: [],
  tags: [],
  utensils: [],
  sortBy: 'relevance',
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  filtered: [],
  filter: defaultFilter,
  loading: true,
  seeded: false,

  init: async () => {
    const { recipes } = get()
    if (recipes.length > 0) return
    const { default: recipesData } = await import('../data/recipes.json')
    const seeded = await db.seedRecipes(recipesData as Recipe[])
    const loaded = await db.recipes.toArray()
    set({ recipes: loaded, filtered: loaded, loading: false, seeded: seeded > 0 })
  },

  setFilter: (partial) => {
    const filter = { ...get().filter, ...partial }
    set({ filter })
    get().applyFilters()
  },

  resetFilters: () => {
    set({ filter: defaultFilter, filtered: get().recipes })
  },

  applyFilters: () => {
    const { recipes, filter } = get()
    let result = [...recipes]

    if (filter.query) {
      const q = filter.query.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q)) ||
        r.tags.some(t => t.includes(q))
      )
    }

    if (filter.category) {
      result = result.filter(r => r.category === filter.category)
    }

    if (filter.difficulty) {
      result = result.filter(r => r.difficulty === filter.difficulty)
    }

    if (filter.maxTime) {
      result = result.filter(r => r.totalTime <= filter.maxTime!)
    }

    if (filter.includeIngredients.length > 0) {
      result = result.filter(r =>
        filter.includeIngredients.every(inc =>
          r.ingredients.some(i => i.name.toLowerCase().includes(inc.toLowerCase()))
        )
      )
    }

    if (filter.excludeIngredients.length > 0) {
      result = result.filter(r =>
        !filter.excludeIngredients.some(exc =>
          r.ingredients.some(i => i.name.toLowerCase().includes(exc.toLowerCase()))
        )
      )
    }

    if (filter.tags.length > 0) {
      result = result.filter(r => filter.tags.some(t => r.tags.includes(t)))
    }

    if (filter.utensils.length > 0) {
      result = result.filter(r => filter.utensils.some(u => r.utensils.includes(u)))
    }

    switch (filter.sortBy) {
      case 'time_asc':
        result.sort((a, b) => a.totalTime - b.totalTime)
        break
      case 'time_desc':
        result.sort((a, b) => b.totalTime - a.totalTime)
        break
      case 'difficulty_asc':
        result.sort((a, b) => {
          const d = { fácil: 1, media: 2, avanzada: 3 }
          return d[a.difficulty] - d[b.difficulty]
        })
        break
      case 'difficulty_desc':
        result.sort((a, b) => {
          const d = { fácil: 1, media: 2, avanzada: 3 }
          return d[b.difficulty] - d[a.difficulty]
        })
        break
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title, 'es'))
        break
      default:
        break
    }

    set({ filtered: result })
  },

  toggleFavorite: async (recipeId) => {
    const recipe = get().recipes.find(r => r.id === recipeId)
    if (!recipe) return
    const newVal = !recipe.isFavorite
    await db.recipes.update(recipeId, { isFavorite: newVal })
    if (newVal) {
      await db.favorites.put({ recipeId, addedAt: Date.now() })
    } else {
      await db.favorites.delete(recipeId)
    }
    const updated = get().recipes.map(r => r.id === recipeId ? { ...r, isFavorite: newVal } : r)
    set({ recipes: updated })
    get().applyFilters()
  },

  toggleMakeLater: async (recipeId) => {
    const recipe = get().recipes.find(r => r.id === recipeId)
    if (!recipe) return
    const newVal = !recipe.isMakeLater
    await db.recipes.update(recipeId, { isMakeLater: newVal })
    if (newVal) {
      await db.makeLater.put({ recipeId, addedAt: Date.now() })
    } else {
      await db.makeLater.delete(recipeId)
    }
    const updated = get().recipes.map(r => r.id === recipeId ? { ...r, isMakeLater: newVal } : r)
    set({ recipes: updated })
    get().applyFilters()
  },

  addToShoppingList: async (recipeId) => {
    const recipe = get().recipes.find(r => r.id === recipeId)
    if (!recipe) return
    await db.recipes.update(recipeId, { inShoppingList: true })
    const updated = get().recipes.map(r => r.id === recipeId ? { ...r, inShoppingList: true } : r)
    set({ recipes: updated })
    get().applyFilters()

    for (const ing of recipe.ingredients) {
      const store = useShoppingStore.getState()
      const exists = store.items.find(i => i.name.toLowerCase() === ing.name.toLowerCase() && i.checked === false)
      if (!exists) {
        await store.addItem({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          checked: false,
          recipeId,
          recipeTitle: recipe.title,
        })
      }
    }
  },

  addRecipe: async (recipe) => {
    await db.recipes.put({ ...recipe, isFavorite: false, isMakeLater: false, inShoppingList: false })
    const loaded = await db.recipes.toArray()
    set({ recipes: loaded })
    get().applyFilters()
  },

  updateRecipe: async (recipe) => {
    await db.recipes.put(recipe)
    const loaded = await db.recipes.toArray()
    set({ recipes: loaded })
    get().applyFilters()
  },

  deleteRecipe: async (recipeId) => {
    await db.recipes.delete(recipeId)
    const loaded = await db.recipes.toArray()
    set({ recipes: loaded })
    get().applyFilters()
  },

  getRecipe: (id) => get().recipes.find(r => r.id === id),
  getFavorites: () => get().recipes.filter(r => r.isFavorite),
  getMakeLater: () => get().recipes.filter(r => r.isMakeLater),
}))
