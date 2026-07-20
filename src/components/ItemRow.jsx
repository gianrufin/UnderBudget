import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  MoreHorizontal,
  Pencil,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

/** A single item row: check off, edit, note, duplicate, reorder, delete. */
export default function ItemRow({
  item,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
  onMove,
}) {
  const { fmt } = useCurrency()
  const [menuOpen, setMenuOpen] = useState(false)
  const lineTotal = item.price * item.quantity

  return (
    <li className="rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center gap-2.5">
        {/* Purchased / in-cart checkbox */}
        <button
          onClick={() => {
            tapHaptic()
            onToggle(item.id)
          }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
            item.purchased
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 text-transparent dark:border-slate-600'
          }`}
          aria-label={item.purchased ? `Mark ${item.name} not in cart` : `Mark ${item.name} in cart`}
        >
          <Check className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onEdit(item)}
          className="min-w-0 flex-1 text-left"
          aria-label={`Edit ${item.name}`}
        >
          <div
            className={`truncate font-medium ${
              item.purchased
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {item.name || 'Untitled item'}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-400 tabular-nums">
            <span>
              {item.quantity} × {fmt(item.price)}
            </span>
            {item.note && (
              <span className="flex items-center gap-0.5 truncate text-slate-400">
                <StickyNote className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.note}</span>
              </span>
            )}
          </div>
        </button>

        <div className="text-right font-semibold text-slate-900 tabular-nums dark:text-white">
          {fmt(lineTotal)}
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={`shrink-0 rounded-full p-2 transition active:scale-90 ${
            menuOpen ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200' : 'text-slate-400'
          }`}
          aria-label="Item actions"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
          <MenuBtn icon={Pencil} label="Edit" onClick={() => { setMenuOpen(false); onEdit(item) }} />
          <MenuBtn icon={Copy} label="Duplicate" onClick={() => { setMenuOpen(false); onDuplicate(item.id) }} />
          <MenuBtn icon={ArrowUp} label="Up" disabled={isFirst} onClick={() => onMove(item.id, -1)} />
          <MenuBtn icon={ArrowDown} label="Down" disabled={isLast} onClick={() => onMove(item.id, 1)} />
          <MenuBtn
            icon={Trash2}
            label="Delete"
            danger
            onClick={() => { setMenuOpen(false); onDelete(item) }}
          />
        </div>
      )}
    </li>
  )
}

function MenuBtn({ icon: Icon, label, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition active:scale-95 disabled:opacity-30 ${
        danger
          ? 'text-red-500 active:bg-red-50 dark:active:bg-red-950/40'
          : 'text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
