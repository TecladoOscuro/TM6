import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({ value, onChange, onFocus, placeholder = 'Buscar recetas...', autoFocus }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-10 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
      />
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
