import Dexie, { type Table } from 'dexie'
import type { Recipe, ShoppingItem } from '../types/recipe'

class MT6Database extends Dexie {
  recipes!: Table<Recipe, string>
  shoppingList!: Table<ShoppingItem, string>
  favorites!: Table<{ recipeId: string; addedAt: number }, string>
  makeLater!: Table<{ recipeId: string; addedAt: number }, string>

  constructor() {
    super('MT6Recipes')
    this.version(1).stores({
      recipes: 'id, category, difficulty, totalTime, *tags, source, isFavorite, isMakeLater',
      shoppingList: 'id, recipeId, checked, name',
      favorites: 'recipeId, addedAt',
      makeLater: 'recipeId, addedAt',
    })
  }

  async seedRecipes(recipes: Recipe[]): Promise<number> {
    const count = await this.recipes.count()
    if (count > 0) {
      const existingIds = new Set(await this.recipes.toCollection().primaryKeys())
      const newOnes = recipes.filter(r => !existingIds.has(r.id))
      if (newOnes.length > 0) {
        await this.recipes.bulkPut(newOnes.map(r => ({ ...r, isFavorite: false, isMakeLater: false, inShoppingList: false, source: 'system' as const })))
      }
      return newOnes.length
    }
    await this.recipes.bulkAdd(recipes.map(r => ({ ...r, isFavorite: false, isMakeLater: false, inShoppingList: false, source: 'system' as const })))
    return recipes.length
  }
}

export const db = new MT6Database()
