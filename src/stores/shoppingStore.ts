import { create } from 'zustand'
import { db } from '../db/database'
import type { ShoppingItem } from '../types/recipe'

interface ShoppingStore {
  items: ShoppingItem[]
  loading: boolean

  init: () => Promise<void>
  addItem: (item: ShoppingItem) => Promise<void>
  toggleItem: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearChecked: () => Promise<void>
  addRecipeIngredients: (recipeId: string, ingredients: { name: string; quantity: number | null; unit: string }[]) => Promise<void>
}

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  items: [],
  loading: true,

  init: async () => {
    const items = await db.shoppingList.toArray()
    set({ items, loading: false })
  },

  addItem: async (item) => {
    await db.shoppingList.put(item)
    const items = await db.shoppingList.toArray()
    set({ items })
  },

  toggleItem: async (id) => {
    const item = await db.shoppingList.get(id)
    if (item) {
      await db.shoppingList.update(id, { checked: !item.checked })
      const items = await db.shoppingList.toArray()
      set({ items })
    }
  },

  removeItem: async (id) => {
    await db.shoppingList.delete(id)
    const items = await db.shoppingList.toArray()
    set({ items })
  },

  clearChecked: async () => {
    const checked = get().items.filter(i => i.checked)
    await db.shoppingList.bulkDelete(checked.map(i => i.id))
    const items = await db.shoppingList.toArray()
    set({ items })
  },

  addRecipeIngredients: async (recipeId, ingredients) => {
    const existing = get().items
    for (const ing of ingredients) {
      const exists = existing.find(i => i.name.toLowerCase() === ing.name.toLowerCase() && !i.checked)
      if (!exists) {
        await db.shoppingList.put({
          id: crypto.randomUUID(),
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          checked: false,
          recipeId,
        })
      }
    }
    const items = await db.shoppingList.toArray()
    set({ items })
  },
}))
