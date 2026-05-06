import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
}

interface ToastStore {
  toasts: Toast[]
  show: (message: string) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message) => {
    const id = crypto.randomUUID()
    set(s => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 2500)
  },
  dismiss: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore()
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none safe-top flex flex-col items-center pt-4 px-4">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-2xl shadow-lg text-sm font-medium max-w-sm"
          >
            <CheckCircle size={18} />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
