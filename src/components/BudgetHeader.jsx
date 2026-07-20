import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { toNumber, clamp } from '../lib/format'
import { useCurrency } from '../context/CurrencyContext'

/**
 * Budget summary: total budget, total spent, remaining balance and a progress
 * bar that turns orange at >=80% and red past 100%.
 */
export default function BudgetHeader({
  budget,
  spent,
  itemCount,
  purchasedCount,
  onBudgetChange,
}) {
  const { fmt, symbol } = useCurrency()
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
    <div className="mx-auto w-full max-w-md px-4 pb-3 pt-1">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                <span className="text-lg text-slate-400">{symbol}</span>
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
              {fmt(budget)}
              <Pencil className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            </button>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {over ? 'Over by' : 'Remaining'}
          </div>
          <div className={`text-2xl font-semibold tabular-nums ${tone.text}`}>
            {fmt(Math.abs(remaining))}
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
              {fmt(spent)}
            </span>
            {itemCount > 0 && purchasedCount > 0 && (
              <span className="text-slate-400"> · {purchasedCount}/{itemCount} in cart</span>
            )}
          </span>
          <span className={pct >= 80 ? tone.text : ''}>{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  )
}
