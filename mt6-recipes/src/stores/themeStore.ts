import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  mode: Theme
  resolved: 'light' | 'dark'
  setTheme: (mode: Theme) => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: Theme): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme()
  return mode
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
}

const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('mt6-theme') : null) as Theme | null
const initial: Theme = stored || 'system'
const initialResolved = resolveTheme(initial)
if (typeof document !== 'undefined') applyTheme(initialResolved)

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initial,
  resolved: initialResolved,
  setTheme: (mode) => {
    const resolved = resolveTheme(mode)
    localStorage.setItem('mt6-theme', mode)
    applyTheme(resolved)
    set({ mode, resolved })
  },
}))

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { mode, setTheme } = useThemeStore.getState()
    if (mode === 'system') {
      setTheme('system')
    }
  })
}
