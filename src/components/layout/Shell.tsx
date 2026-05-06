import { Outlet, useNavigate } from 'react-router-dom'
import TabBar from './TabBar'
import { useEffect } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import { useShoppingStore } from '@/stores/shoppingStore'
import { ToastContainer } from '@/stores/toastStore'

export default function Shell() {
  const initRecipes = useRecipeStore(s => s.init)
  const initShopping = useShoppingStore(s => s.init)
  const navigate = useNavigate()

  useEffect(() => { initRecipes(); initShopping() }, [])
  useEffect(() => { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission() }, [])
  useEffect(() => { if (window.location.pathname === '/TM6/' || window.location.pathname === '/TM6') navigate('/search', { replace: true }) }, [])

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-hidden">
      <ToastContainer />
      <main className="pb-24 safe-top">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
