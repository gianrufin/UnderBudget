import { useEffect, useRef } from 'react'
import { Menu, RotateCcw, Trash2, ListRestart, Undo2, Coins } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

/**
 * Secondary actions that don't need to live in the thumb zone: reset budget,
 * start a new list, clear all items, undo, change currency. A lightweight
 * dropdown, not a full-screen sheet.
 */
export default function OverflowMenu({
  open,
  onOpen,
  onClose,
  onResetBudget,
  onNewListKeepBudget,
  onClearAll,
  onUndo,
  canUndo,
  hasBudget,
  onOpenCurrency,
}) {
  const { currency } = useCurrency()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors active:scale-95"
        style={{ borderColor: 'var(--border-color)', color: 'var(--accent-color)' }}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border shadow-lg"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
        >
          <MenuItem
            icon={Undo2}
            label="Undo last item"
            disabled={!canUndo}
            onClick={() => {
              onUndo()
              onClose()
            }}
          />
          <MenuItem
            icon={ListRestart}
            label="New list (keep budget)"
            disabled={!hasBudget}
            onClick={() => {
              onNewListKeepBudget()
              onClose()
            }}
          />
          <MenuItem
            icon={Trash2}
            label="Clear all items"
            onClick={() => {
              onClearAll()
              onClose()
            }}
          />
          <MenuItem
            icon={RotateCcw}
            label="Reset budget"
            onClick={() => {
              onResetBudget()
              onClose()
            }}
          />
          <MenuItem
            icon={Coins}
            label={`Currency (${currency})`}
            onClick={() => {
              onOpenCurrency()
              onClose()
            }}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
    >
      <Icon className="h-4 w-4 opacity-70" />
      {label}
    </button>
  )
}
