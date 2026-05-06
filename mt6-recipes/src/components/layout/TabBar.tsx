import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Search, Bookmark, ShoppingBasket, Settings } from 'lucide-react'

const tabs = [
  { to: '/', icon: Compass, label: 'Explorar' },
  { to: '/search', icon: Search, label: 'Buscar' },
  { to: '/saved', icon: Bookmark, label: 'Guardados' },
  { to: '/shopping', icon: ShoppingBasket, label: 'Compra' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-xl border-t border-[var(--color-border)] safe-bottom">
      <div className="flex items-center justify-around h-[50px] max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="relative flex flex-col items-center justify-center w-full h-full"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 w-8 h-0.5 bg-[var(--color-accent)] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
