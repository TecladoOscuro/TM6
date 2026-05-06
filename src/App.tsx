import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Shell from '@/components/layout/Shell'
import SearchPage from '@/pages/SearchPage'
import RecipeDetailPage from '@/pages/RecipeDetailPage'
import SavedPage from '@/pages/SavedPage'
import ShoppingListPage from '@/pages/ShoppingListPage'
import SettingsPage from '@/pages/SettingsPage'
import AddRecipePage from '@/pages/AddRecipePage'
import CookingModePage from '@/pages/CookingModePage'

export default function App() {
  return (
    <BrowserRouter basename="/TM6">
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Navigate to="/search" replace />} />
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
