import { useState } from 'react'
import { Check, Pencil, Wallet } from 'lucide-react'
import { formatCurrency, toNumber, clamp } from '../lib/format'

/**
 * Sticky top bar: total budget, total spent, remaining balance and a progress
 * bar that turns orange at >=80% and red at >100%.
 */
export default function BudgetHeader({ budget, spent, onBudgetChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(budget || ''))

  const remaining = budget - spent
  const pct = budget > 0 ? (spent / budget) * 100 : 0
  const barWidth = clamp(pct, 0, 100)
  const over = remaining < 0

  const tone =
    pct > 100
      ? { bar: 'bg-red-500', text: 'text-red-500' }
      : pct >= 80
        ? { bar: 'bg-orange-500', text: 'text-orange-500' }
        : { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }

  function startEditing() {
    setDraft(budget ? String(budget) : '')
    setEditing(true)
  }

  function commit() {
    onBudgetChange(toNumber(draft))
    setEditing(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto w-full max-w-md px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              <Wallet className="h-3.5 w-3.5" />
              Budget
            </div>

            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  commit()
                }}
                className="mt-0.5 flex items-center gap-2"
              >
                <div className="flex items-center rounded-lg bg-slate-100 px-2 dark:bg-slate-800">
                  <span className="text-lg text-slate-400">$</span>
                  <input
                    autoFocus
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    placeholder="0.00"
                    className="w-28 bg-transparent py-1 text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-500 p-1.5 text-white active:scale-95"
                  aria-label="Save budget"
                >
                  <Check className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={startEditing}
                className="mt-0.5 flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white"
              >
                {formatCurrency(budget)}
                <Pencil className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              </button>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {over ? 'Over by' : 'Remaining'}
            </div>
            <div className={`text-2xl font-semibold tabular-nums ${tone.text}`}>
              {formatCurrency(Math.abs(remaining))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${tone.bar}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs tabular-nums text-slate-400">
            <span>
              Spent{' '}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {formatCurrency(spent)}
              </span>
            </span>
            <span className={pct >= 80 ? tone.text : ''}>{Math.round(pct)}%</span>
          </div>
        </div>
      </div>
    </header>
  )
}
