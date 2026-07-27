import { useState } from 'react'
import { ChevronDown, ChevronRight, X, ArrowRight } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

/**
 * A separate "before you shop" list: plan item names now, without prices,
 * then tap one in-store to drop straight into the price keypad. Unlike a
 * plain checklist, it remembers what you paid last time and forecasts a
 * total before you've bought anything.
 */
export default function PlanningList({
  plannedItems,
  priceMemory,
  estimate,
  expanded,
  onToggleExpanded,
  onAdd,
  onRemove,
  onConvert,
}) {
  const { fmt } = useCurrency()
  const [draft, setDraft] = useState('')

  function submitDraft() {
    const names = draft.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
    if (names.length === 0) return
    onAdd(names)
    setDraft('')
  }

  const hasItems = plannedItems.length > 0

  return (
    <div
      className="mx-4 mt-3 overflow-hidden rounded-xl border transition-colors duration-500"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
    >
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-70">
          {expanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
          {hasItems ? `Planning list (${plannedItems.length})` : 'Plan your next shop'}
        </span>
        {hasItems && estimate > 0 && (
          <span className="shrink-0 text-xs font-medium tabular-nums opacity-60">Est. {fmt(estimate)}</span>
        )}
      </button>

      {expanded && (
        <div className="border-t px-3.5 pb-3.5 pt-3" style={{ borderColor: 'var(--border-color)' }}>
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

          {hasItems && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {plannedItems.map((p) => {
                const remembered = priceMemory[p.name.toLowerCase()]
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 rounded-lg border px-2.5 py-2"
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
                      }}
                      aria-label={`Buy ${p.name} now`}
                      className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-white active:scale-95"
                      style={{ backgroundColor: 'var(--primary-button-color)' }}
                    >
                      Buy
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      aria-label={`Remove ${p.name} from plan`}
                      className="shrink-0 rounded-md p-1 opacity-50 hover:opacity-90"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
