import { useEffect, useRef, useState } from 'react'
import { Search, Check } from 'lucide-react'
import { CURRENCIES } from '../lib/currencies'

/** Interactive, searchable list of major world currencies. */
export default function CurrencyPicker({ open, currency, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const results = q
    ? CURRENCIES.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      )
    : CURRENCIES

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Choose currency"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[75vh] w-full flex-col rounded-t-2xl border shadow-xl sm:max-w-sm sm:rounded-2xl"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        <div className="shrink-0 border-b p-4" style={{ borderColor: 'var(--border-color)' }}>
          <p className="mb-3 text-sm font-semibold">Currency</p>
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currencies"
              aria-label="Search currencies"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto py-1" role="listbox" aria-label="Currencies">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm opacity-60">No currencies match "{query}"</li>
          )}
          {results.map((c) => {
            const active = c.code === currency
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onSelect(c.code)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    {c.symbol}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{c.name}</span>
                    <span className="block text-xs opacity-60">{c.code}</span>
                  </span>
                  {active && <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-color)' }} />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
