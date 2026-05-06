import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  mode: Theme
  setTheme: (mode: Theme) => void
}

function applyTheme(mode: Theme) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.style.colorScheme = mode
}

const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('tm6-theme') : null) as Theme | null
const initial: Theme = stored === 'dark' ? 'dark' : 'light'
if (typeof document !== 'undefined') applyTheme(initial)

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initial,
  setTheme: (mode) => {
    localStorage.setItem('tm6-theme', mode)
    applyTheme(mode)
    set({ mode })
  },
}))
