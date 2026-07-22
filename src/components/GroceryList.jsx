import { useMemo } from 'react'
import { Trash2 } from 'lucide-react'
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

export default function GroceryList({
  items,
  sortMode,
  onSortChange,
  lastAddedId,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onClearAll,
}) {
  const sorted = useMemo(() => [...items].sort(SORTERS[sortMode] ?? SORTERS.recent), [items, sortMode])

  return (
    <section className="mx-4 mt-4 mb-2 flex-1" aria-label="Grocery items">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Your items ({items.length})
        </h2>
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

      <div
        className="overflow-hidden rounded-2xl border transition-colors duration-500"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        {sorted.length === 0 ? (
          <EmptyState />
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
                onDuplicate={onDuplicate}
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
