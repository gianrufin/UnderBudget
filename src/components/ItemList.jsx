import { ListPlus, Trash } from 'lucide-react'
import ItemRow from './ItemRow'

/** Scrollable middle area listing all items (or an empty state). */
export default function ItemList({ items, onEdit, onDelete, onAdd, onClearAll }) {
  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
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

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          List · {items.length} {items.length === 1 ? 'item' : 'items'}
        </h2>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 active:text-red-500"
        >
          <Trash className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  )
}
