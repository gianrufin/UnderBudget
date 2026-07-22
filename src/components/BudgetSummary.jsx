import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { formatCurrency } from '../lib/format'
import BudgetProgress from './BudgetProgress'
import BudgetStatus from './BudgetStatus'
import BudgetEditor from './BudgetEditor'

export default function BudgetSummary({ budget, spent, ratio, status, onBudgetChange }) {
  const [editorOpen, setEditorOpen] = useState(false)
  const remaining = budget - spent
  const overBudget = remaining < 0
  const percent = ratio * 100

  return (
    <section
      className="mx-4 mt-4 rounded-2xl border p-4 shadow-sm transition-colors duration-500"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      aria-label="Budget summary"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide opacity-60">Total amount</p>
          <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight transition-colors duration-500">
            {formatCurrency(spent)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
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

      <p
        className="mt-1 text-sm font-medium transition-colors duration-500"
        style={{ color: overBudget ? 'var(--warning-color)' : 'var(--accent-color)' }}
      >
        {overBudget
          ? `${formatCurrency(Math.abs(remaining))} over budget`
          : `${formatCurrency(remaining)} remaining`}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <BudgetProgress percent={percent} />
        <span className="shrink-0 text-xs font-medium tabular-nums opacity-70">
          {Math.round(percent)}% used
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        Budget status: {status}
      </p>

      <BudgetStatus status={status} overBudget={overBudget} />

      <BudgetEditor
        open={editorOpen}
        budget={budget}
        onClose={() => setEditorOpen(false)}
        onSave={onBudgetChange}
      />
    </section>
  )
}
