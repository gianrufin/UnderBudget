import { useMemo, useState } from 'react'
import { Trash2, EyeOff, Eye, Search, X } from 'lucide-react'
import GroceryItemRow from './GroceryItemRow'
import EmptyState from './EmptyState'

const SORTERS = {
  recent: (a, b) => b.createdAt - a.createdAt,
  'price-desc': (a, b) => b.price * b.quantity - a.price * a.quantity,
  'price-asc': (a, b) => a.price * a.quantity - b.price * b.quantity,
  alpha: (a, b) => a.name.localeCompare(b.name),
}

const SORT_LABELS = {
  recent: 'Recently added',
  'price-desc': 'Highest price',
  'price-asc': 'Lowest price',
  alpha: 'Alphabetical',
}

// Only surface a search box once a list is long enough that scanning by eye
// stops being faster than typing a few letters.
const SEARCH_THRESHOLD = 8

export default function GroceryList({
  items,
  sortMode,
  onSortChange,
  hideCompleted,
  onToggleHideCompleted,
  lastAddedId,
  onToggle,
  onEdit,
  onDelete,
  onAdjustQuantity,
  onClearAll,
}) {
  const [query, setQuery] = useState('')

  const visible = useMemo(
    () => (hideCompleted ? items.filter((it) => !it.purchased) : items),
    [items, hideCompleted],
  )
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? visible.filter((it) => it.name.toLowerCase().includes(q)) : visible
  }, [visible, query])
  const sorted = useMemo(() => [...searched].sort(SORTERS[sortMode] ?? SORTERS.recent), [searched, sortMode])
  const purchasedCount = items.length - items.filter((it) => !it.purchased).length

  return (
    <section className="mx-4 mt-4 mb-2 flex-1" aria-label="Grocery items">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-y-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Your items ({hideCompleted || query ? `${sorted.length} of ${items.length}` : items.length})
        </h2>
        <div className="flex items-center gap-2">
          {purchasedCount > 0 && (
            <button
              type="button"
              onClick={onToggleHideCompleted}
              aria-pressed={hideCompleted}
              className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs opacity-70 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {hideCompleted ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {hideCompleted ? 'Show all' : 'Hide purchased'}
            </button>
          )}
          {items.length > 1 && (
            <label className="flex items-center gap-1.5 text-xs opacity-70">
              Sort:
              <select
                value={sortMode}
                onChange={(e) => onSortChange(e.target.value)}
                className="rounded-md border bg-transparent px-1.5 py-1 text-xs outline-none"
                style={{ borderColor: 'var(--border-color)' }}
                aria-label="Sort items"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {items.length >= SEARCH_THRESHOLD && (
        <div
          className="mb-2 flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 opacity-50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items"
            aria-label="Search items"
            className="w-full bg-transparent text-sm outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="shrink-0 opacity-50">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      <div
        className="overflow-hidden rounded-2xl border transition-colors duration-500"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        {sorted.length === 0 ? (
          <EmptyState hideCompleted={hideCompleted && items.length > 0} />
        ) : (
          <ul>
            {sorted.map((item) => (
              <GroceryItemRow
                key={item.id}
                item={item}
                isNew={item.id === lastAddedId}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onAdjustQuantity={onAdjustQuantity}
              />
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium opacity-70 transition-colors active:scale-[0.99]"
          style={{ borderColor: 'var(--border-color)', color: 'var(--warning-color)' }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all items
        </button>
      )}
    </section>
  )
}
