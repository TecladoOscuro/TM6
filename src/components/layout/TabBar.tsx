import { NavLink } from 'react-router-dom'
import { Search, Bookmark, ShoppingBasket, Settings } from 'lucide-react'

const tabs = [
  { to: '/search', icon: Search, label: 'Buscar' },
  { to: '/saved', icon: Bookmark, label: 'Guardados' },
  { to: '/shopping', icon: ShoppingBasket, label: 'Compra' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t safe-bottom">
      <div className="flex items-center justify-around h-[50px] max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="relative flex flex-col items-center justify-center w-full h-full"
          >
            {({ isActive }) => (
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
              />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
