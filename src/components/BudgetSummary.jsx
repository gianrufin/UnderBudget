import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import BudgetProgress from './BudgetProgress'
import BudgetStatus from './BudgetStatus'
import BudgetEditor from './BudgetEditor'

export default function BudgetSummary({ budget, spent, ratio, status, onBudgetChange, compact = false }) {
  const { fmt: formatCurrency } = useCurrency()
  const [editorOpen, setEditorOpen] = useState(false)
  const remaining = budget - spent
  const overBudget = remaining < 0
  const percent = ratio * 100

  return (
    <section
      className={`border shadow-sm transition-all duration-300 ease-out ${
        compact
          ? 'mx-0 mt-0 rounded-none border-x-0 border-t-0 p-2.5 px-4'
          : 'mx-4 mt-4 rounded-2xl p-4'
      }`}
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      aria-label="Budget summary"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          {!compact && (
            <p className="text-xs font-medium uppercase tracking-wide opacity-60">Total amount</p>
          )}
          <p
            className={`font-bold tabular-nums tracking-tight transition-all duration-300 ease-out ${
              compact ? 'text-xl' : 'mt-1 text-4xl'
            }`}
          >
            {formatCurrency(spent)}
          </p>
        </div>
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: compact ? 0 : 64, opacity: compact ? 0 : 1 }}
          aria-hidden={compact}
        >
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            tabIndex={compact ? -1 : 0}
            className="flex shrink-0 flex-col items-end gap-0.5 rounded-lg border px-3 py-1.5 text-right active:scale-95"
            style={{ borderColor: 'var(--border-color)' }}
            aria-label={`Budget: ${formatCurrency(budget)}. Tap to edit.`}
          >
            <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide opacity-60">
              Budget <Pencil className="h-3 w-3" />
            </span>
            <span className="text-base font-semibold tabular-nums">{formatCurrency(budget)}</span>
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: compact ? 0 : 32, opacity: compact ? 0 : 1 }}
        aria-hidden={compact}
      >
        <p
          className="mt-1 text-sm font-medium transition-colors duration-500"
          style={{ color: overBudget ? 'var(--warning-color)' : 'var(--accent-color)' }}
        >
          {overBudget
            ? `${formatCurrency(Math.abs(remaining))} over budget`
            : `${formatCurrency(remaining)} remaining`}
        </p>
      </div>

      <div className={`flex items-center gap-3 transition-all duration-300 ease-out ${compact ? 'mt-1.5' : 'mt-3'}`}>
        <BudgetProgress percent={percent} />
        <span className="shrink-0 text-xs font-medium tabular-nums opacity-70">
          {Math.round(percent)}% used
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        Budget status: {status}
      </p>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: compact ? 0 : 80, opacity: compact ? 0 : 1 }}
        aria-hidden={compact}
      >
        <BudgetStatus status={status} overBudget={overBudget} />
      </div>

      <BudgetEditor
        open={editorOpen}
        budget={budget}
        onClose={() => setEditorOpen(false)}
        onSave={onBudgetChange}
      />
    </section>
  )
}
