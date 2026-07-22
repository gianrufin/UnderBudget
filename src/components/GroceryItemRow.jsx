import { Pencil, Trash2, Copy, Check } from 'lucide-react'
import { formatCurrency } from '../lib/format'

export default function GroceryItemRow({ item, isNew, onToggle, onEdit, onDelete, onDuplicate }) {
  const subtotal = item.price * item.quantity

  return (
    <li
      className={`flex items-center gap-3 border-b px-4 py-3 transition-colors duration-500 ${
        isNew ? 'motion-safe:animate-[itemIn_0.3s_ease-out]' : ''
      }`}
      style={{ borderColor: 'var(--border-color)' }}
    >
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        aria-pressed={item.purchased}
        aria-label={item.purchased ? `Mark ${item.name} as not purchased` : `Mark ${item.name} as purchased`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-95"
        style={{
          borderColor: item.purchased ? 'var(--accent-color)' : 'var(--border-color)',
          backgroundColor: item.purchased ? 'var(--accent-color)' : 'transparent',
        }}
      >
        {item.purchased && <Check className="h-3.5 w-3.5 text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${item.purchased ? 'opacity-40 line-through' : ''}`}>
          {item.name}
        </p>
        <p className="text-xs tabular-nums opacity-50">
          {formatCurrency(item.price)} × {item.quantity}
        </p>
      </div>

      <p className={`shrink-0 text-sm font-semibold tabular-nums ${item.purchased ? 'opacity-40' : ''}`}>
        {formatCurrency(subtotal)}
      </p>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton label={`Duplicate ${item.name}`} onClick={() => onDuplicate(item.id)}>
          <Copy className="h-4 w-4" />
        </IconButton>
        <IconButton label={`Edit ${item.name}`} onClick={() => onEdit(item)}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton label={`Delete ${item.name}`} onClick={() => onDelete(item)}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
  )
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg opacity-60 transition-transform hover:opacity-100 active:scale-90"
    >
      {children}
    </button>
  )
}
