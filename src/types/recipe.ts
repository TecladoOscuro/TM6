export type Category =
  | 'cremas_sopas'
  | 'entrantes_dips'
  | 'ensaladas'
  | 'verduras_varoma'
  | 'arroces'
  | 'pastas'
  | 'legumbres'
  | 'carnes'
  | 'aves'
  | 'pescados'
  | 'mariscos'
  | 'huevos_tortillas'
  | 'panes_masas'
  | 'salsas'
  | 'postres'
  | 'bebidas'
  | 'infantil'
  | 'conservas'
  | 'masas_base'
  | 'platos_unicos'

export type Difficulty = 'fácil' | 'media' | 'avanzada'

export type DietTag =
  | 'vegano'
  | 'vegetariano'
  | 'sin_gluten'
  | 'sin_lactosa'
  | 'sin_frutos_secos'
  | 'sin_huevo'
  | 'sin_azucar'
  | 'bajo_en_grasas'
  | 'alto_en_proteinas'
  | 'fit'
  | 'tradicional'
  | 'rapida'
  | 'economica'
  | 'sin_soja'

export type TM6Accessory = 'mariposa' | 'cestillo' | 'varoma' | 'paleta' | 'espatula'

export interface Ingredient {
  name: string
  quantity: number | null
  unit: string
  optional?: boolean
  group?: string
  prep?: string
}

export interface TM6Step {
  stepNumber: number
  instruction: string
  temperature?: number | 'varoma'
  speed?: number | 'cuchara' | 'espiga' | 'velocidad cuchara'
  time: number
  reverse?: boolean
  accessory?: TM6Accessory
  note?: string
}

export interface Nutrition {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface Recipe {
  id: string
  title: string
  description: string
  category: Category
  subcategory?: string
  difficulty: Difficulty
  totalTime: number
  prepTime: number
  cookTime: number
  servings: number
  image?: string

  ingredients: Ingredient[]
  steps: TM6Step[]

  tags: DietTag[]
  utensils: TM6Accessory[]
  nutrition?: Nutrition

  // IndexedDB fields (not in JSON seed)
  isFavorite?: boolean
  isMakeLater?: boolean
  inShoppingList?: boolean
  userNotes?: string
  rating?: number
  timesCooked?: number
  source: 'system' | 'user'
  createdAt?: number
  updatedAt?: number
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number | null
  unit: string
  checked: boolean
  recipeId?: string
  category?: string
}

export interface FilterState {
  query: string
  category: Category | null
  difficulty: Difficulty | null
  maxTime: number | null
  includeIngredients: string[]
  excludeIngredients: string[]
  tags: DietTag[]
  utensils: TM6Accessory[]
  sortBy: 'relevance' | 'time_asc' | 'time_desc' | 'difficulty_asc' | 'difficulty_desc' | 'title_asc'
}

export const CATEGORY_LABELS: Record<Category, string> = {
  cremas_sopas: 'Cremas y sopas',
  entrantes_dips: 'Entrantes y dips',
  ensaladas: 'Ensaladas',
  verduras_varoma: 'Verduras al vapor',
  arroces: 'Arroces',
  pastas: 'Pastas',
  legumbres: 'Legumbres',
  carnes: 'Carnes',
  aves: 'Aves',
  pescados: 'Pescados',
  mariscos: 'Mariscos',
  huevos_tortillas: 'Huevos y tortillas',
  panes_masas: 'Panes y masas',
  salsas: 'Salsas',
  postres: 'Postres',
  bebidas: 'Bebidas',
  infantil: 'Infantil',
  conservas: 'Conservas',
  masas_base: 'Masas base',
  platos_unicos: 'Platos únicos',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  cremas_sopas: '🥣',
  entrantes_dips: '🥑',
  ensaladas: '🥗',
  verduras_varoma: '🥦',
  arroces: '🍚',
  pastas: '🍝',
  legumbres: '🫘',
  carnes: '🥩',
  aves: '🍗',
  pescados: '🐟',
  mariscos: '🦐',
  huevos_tortillas: '🍳',
  panes_masas: '🍞',
  salsas: '🫙',
  postres: '🍰',
  bebidas: '🥤',
  infantil: '👶',
  conservas: '🫙',
  masas_base: '🧈',
  platos_unicos: '🍽️',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  fácil: 'Fácil',
  media: 'Media',
  avanzada: 'Avanzada',
}

export const DIET_TAG_LABELS: Record<DietTag, string> = {
  vegano: 'Vegano',
  vegetariano: 'Vegetariano',
  sin_gluten: 'Sin gluten',
  sin_lactosa: 'Sin lactosa',
  sin_frutos_secos: 'Sin frutos secos',
  sin_huevo: 'Sin huevo',
  sin_azucar: 'Sin azúcar',
  bajo_en_grasas: 'Bajo en grasas',
  alto_en_proteinas: 'Alto en proteínas',
  fit: 'Fit',
  tradicional: 'Tradicional',
  rapida: 'Rápida',
  economica: 'Económica',
  sin_soja: 'Sin soja',
}

export const ACCESSORY_LABELS: Record<TM6Accessory, string> = {
  mariposa: 'Mariposa',
  cestillo: 'Cestillo',
  varoma: 'Varoma',
  paleta: 'Paleta',
  espatula: 'Espátula',
}
