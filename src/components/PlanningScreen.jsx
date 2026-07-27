import { useState } from 'react'
import { ArrowLeft, X, ArrowRight, ClipboardList } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

/**
 * A separate "before you shop" screen — kept off the main cart view so that
 * one doesn't crowd the other. Plan item names now, without prices, then
 * open this and tap one in-store to drop straight into the price keypad.
 * Unlike a plain checklist, it remembers what you paid last time and
 * forecasts a total before you've bought anything.
 */
export default function PlanningScreen({
  open,
  plannedItems,
  priceMemory,
  estimate,
  onClose,
  onAdd,
  onRemove,
  onConvert,
}) {
  const { fmt } = useCurrency()
  const [draft, setDraft] = useState('')

  if (!open) return null

  function submitDraft() {
    const names = draft.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
    if (names.length === 0) return
    onAdd(names)
    setDraft('')
  }

  const hasItems = plannedItems.length > 0

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: 'var(--surface-color)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Plan your next shop"
    >
      <header
        className="flex shrink-0 items-center gap-3 border-b px-4 py-3 transition-colors duration-500"
        style={{ borderColor: 'var(--border-color)', paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to your list"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-70 active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold">Plan your next shop</h1>
          {hasItems && estimate > 0 && (
            <p className="text-xs opacity-60 tabular-nums">Estimated total {fmt(estimate)}</p>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submitDraft()
              }
            }}
            rows={2}
            autoFocus
            placeholder="Add item, or paste a list…"
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
          />
          <button
            type="button"
            onClick={submitDraft}
            disabled={!draft.trim()}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: 'var(--primary-button-color)' }}
          >
            Add
          </button>
        </div>

        {hasItems ? (
          <ul className="mt-4 flex flex-col gap-2">
            {plannedItems.map((p) => {
              const remembered = priceMemory[p.name.toLowerCase()]
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                  {remembered != null && (
                    <span className="shrink-0 text-xs tabular-nums opacity-50">~{fmt(remembered)}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      tapHaptic(6)
                      onConvert(p)
                      onClose()
                    }}
                    aria-label={`Buy ${p.name} now`}
                    className="flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white active:scale-95"
                    style={{ backgroundColor: 'var(--primary-button-color)' }}
                  >
                    Buy
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.name} from plan`}
                    className="shrink-0 rounded-md p-1.5 opacity-50 hover:opacity-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <ClipboardList className="h-8 w-8 opacity-30" aria-hidden="true" />
            <p className="text-sm font-medium opacity-70">Nothing planned yet</p>
            <p className="max-w-[28ch] text-xs opacity-50">
              Add what you need above, even before you leave the house. Bring it up here once
              you're in the store.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
