import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Shell from './components/layout/Shell'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import SavedPage from './pages/SavedPage'
import ShoppingListPage from './pages/ShoppingListPage'
import SettingsPage from './pages/SettingsPage'
import AddRecipePage from './pages/AddRecipePage'
import CookingModePage from './pages/CookingModePage'
import { useRecipeStore } from './stores/recipeStore'
import { useShoppingStore } from './stores/shoppingStore'

export default function App() {
  const initRecipes = useRecipeStore(s => s.init)
  const initShopping = useShoppingStore(s => s.init)

  useEffect(() => {
    initRecipes()
    initShopping()
  }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <BrowserRouter basename="/TM6">
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/cook/:id" element={<CookingModePage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
      </Routes>
    </BrowserRouter>
  )
}
