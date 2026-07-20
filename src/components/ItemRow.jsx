import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '../lib/format'

/** A single row in the item list, with edit + delete affordances. */
export default function ItemRow({ item, onEdit, onDelete }) {
  const lineTotal = item.price * item.quantity

  return (
    <li className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <button
        onClick={() => onEdit(item)}
        className="min-w-0 flex-1 text-left"
        aria-label={`Edit ${item.name}`}
      >
        <div className="truncate font-medium text-slate-900 dark:text-white">
          {item.name || 'Untitled item'}
        </div>
        <div className="mt-0.5 text-sm text-slate-400 tabular-nums">
          {item.quantity} × {formatCurrency(item.price)}
        </div>
      </button>

      <div className="text-right font-semibold text-slate-900 tabular-nums dark:text-white">
        {formatCurrency(lineTotal)}
      </div>

      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={() => onEdit(item)}
          className="rounded-full p-2 text-slate-400 active:scale-90 active:bg-slate-100 dark:active:bg-slate-800"
          aria-label={`Edit ${item.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="rounded-full p-2 text-slate-400 active:scale-90 active:bg-red-50 active:text-red-500 dark:active:bg-red-950"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}
