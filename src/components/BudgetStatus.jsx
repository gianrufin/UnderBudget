import { AlertTriangle } from 'lucide-react'

const MESSAGES = {
  Comfortable: "You're well within budget.",
  'On track': "You're on track with your budget.",
  'Be mindful': "You're getting close to your budget limit.",
  'Near your limit': "You're nearing your budget limit.",
  'Almost at budget': "You're almost at your budget limit.",
  'Over budget': 'You have exceeded your budget.',
}

/**
 * Text status is never color-only: the label ("Be mindful", "Over budget", …)
 * always ships alongside the tint, and is announced to screen readers.
 */
export default function BudgetStatus({ status, overBudget }) {
  const showBanner = status !== 'Comfortable' && status !== 'On track'
  if (!showBanner) return null

  return (
    <div
      className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-slate-900 transition-colors duration-500 dark:text-white"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--glow-color)',
      }}
      role="status"
      aria-live="polite"
    >
      <AlertTriangle
        className={`h-4 w-4 shrink-0 ${overBudget ? 'motion-safe:animate-pulse' : ''}`}
        style={{ color: 'var(--warning-color)' }}
      />
      <span>{MESSAGES[status]}</span>
    </div>
  )
}
