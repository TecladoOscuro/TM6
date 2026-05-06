import { motion } from 'framer-motion'
import { Clock, ChefHat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Recipe } from '../../types/recipe'
import { DIFFICULTY_LABELS } from '../../types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  index?: number
}

function timeStr(minutes: number): string {
  if (minutes < 60) return `${minutes}'`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}'` : `${h}h`
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="group relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 active:scale-[0.98] transition-transform cursor-pointer hover:border-[var(--color-accent)]/30 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-surface-alt)] flex items-center justify-center text-2xl">
          🧑‍🍳
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-[var(--color-text)] leading-tight truncate">
            {recipe.title}
          </h3>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
              <Clock size={12} />
              {timeStr(recipe.totalTime)}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
              <ChefHat size={12} />
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {recipe.servings} {recipe.servings === 1 ? 'ración' : 'raciones'}
            </span>
          </div>
        </div>

        {/* Right arrows */}
        <div className="flex-shrink-0 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity mt-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
              {tag.replace(/_/g, ' ')}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] text-[var(--color-text-tertiary)]">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
