import { useState } from 'react'
import { ArrowUpDown, ListPlus, Trash } from 'lucide-react'
import ItemRow from './ItemRow'
import { useCurrency } from '../context/CurrencyContext'

const SORTS = [
  { mode: 'nameAsc', label: 'Name (A–Z)' },
  { mode: 'priceDesc', label: 'Price (high → low)' },
  { mode: 'priceAsc', label: 'Price (low → high)' },
  { mode: 'unpurchased', label: 'To buy first' },
]

/** Scrollable middle area: the item list, sort control, and an empty state. */
export default function ItemList({
  items,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
  onMove,
  onSort,
  onAdd,
  onClearAll,
}) {
  const { fmt } = useCurrency()
  const [sortOpen, setSortOpen] = useState(false)

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 pb-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          <ListPlus className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Your list is empty
        </h2>
        <p className="mt-1 max-w-xs text-sm text-slate-400">
          Add your first item to start tracking. Use the calculator below to work
          out a price before you add it.
        </p>
        <button
          onClick={onAdd}
          className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white active:scale-95 dark:bg-white dark:text-slate-900"
        >
          Add an item
        </button>
      </div>
    )
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const purchased = items.filter((i) => i.purchased).length

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          List · {items.length} {items.length === 1 ? 'item' : 'items'}
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-medium text-slate-400 active:text-slate-600 dark:active:text-slate-200"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort
            </button>
            {sortOpen && (
              <>
                <button
                  className="fixed inset-0 z-10 cursor-default"
                  aria-hidden
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-6 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {SORTS.map((s) => (
                    <button
                      key={s.mode}
                      onClick={() => {
                        onSort(s.mode)
                        setSortOpen(false)
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-600 active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-700"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 active:text-red-500"
          >
            <Trash className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <ItemRow
            key={item.id}
            item={item}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onDuplicate={onDuplicate}
            onMove={onMove}
          />
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-400">
        <span>{purchased} in cart</span>
        <span className="tabular-nums">
          Subtotal{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {fmt(subtotal)}
          </span>
        </span>
      </div>
    </div>
  )
}
