import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '../lib/format'

/** Small inline editor for the budget amount, opened from the summary card. */
export default function BudgetEditor({ open, budget, onClose, onSave }) {
  const [value, setValue] = useState(String(budget ?? ''))
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setValue(budget ? String(budget) : '')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open, budget])

  if (!open) return null

  function submit(e) {
    e.preventDefault()
    const amount = parseFloat(value)
    if (Number.isFinite(amount) && amount > 0) {
      onSave(amount)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit budget"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-xl border p-5 shadow-xl"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        <label htmlFor="budget-editor-input" className="mb-2 block text-xs font-medium uppercase tracking-wide opacity-60">
          Grocery budget
        </label>
        <div className="flex items-center gap-1 rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-color)' }}>
          <span className="opacity-60">₱</span>
          <input
            id="budget-editor-input"
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
            className="w-full bg-transparent text-lg font-semibold tabular-nums outline-none"
            placeholder="0.00"
          />
        </div>
        <p className="mt-1 text-xs opacity-60">Current: {formatCurrency(budget ?? 0)}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border py-2.5 text-sm font-medium active:scale-95"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white active:scale-95"
            style={{ backgroundColor: 'var(--primary-button-color)' }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
