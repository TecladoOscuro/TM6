import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function Shell() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] text-[var(--color-text)] overflow-hidden">
      <main className="pb-24 safe-top">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
