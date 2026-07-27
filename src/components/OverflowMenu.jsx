import { useEffect, useRef } from 'react'
import {
  Menu,
  RotateCcw,
  Trash2,
  ListRestart,
  Undo2,
  Coins,
  Coffee,
  Share2,
  History,
  Vibrate,
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

/**
 * Secondary actions that don't need to live in the thumb zone. A lightweight
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
  onOpenSupport,
  onShareList,
  canShare,
  onRestockLastList,
  canRestock,
  hapticsEnabled,
  onToggleHaptics,
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
          className="absolute right-0 top-11 z-50 max-h-[75vh] w-56 overflow-y-auto rounded-xl border shadow-lg"
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
            icon={History}
            label="Restock last list"
            disabled={!canRestock}
            onClick={() => {
              onRestockLastList()
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

          <Divider />

          <MenuItem
            icon={Share2}
            label="Share list"
            disabled={!canShare}
            onClick={() => {
              onShareList()
              onClose()
            }}
          />

          <Divider />

          <MenuItem
            icon={Coins}
            label={`Currency (${currency})`}
            onClick={() => {
              onOpenCurrency()
              onClose()
            }}
          />
          <MenuItem
            icon={Vibrate}
            label={`Haptics: ${hapticsEnabled ? 'On' : 'Off'}`}
            onClick={onToggleHaptics}
          />
          <MenuItem
            icon={RotateCcw}
            label="Reset budget"
            onClick={() => {
              onResetBudget()
              onClose()
            }}
          />

          <Divider />

          <MenuItem
            icon={Coffee}
            label="Buy me a coffee"
            onClick={() => {
              onOpenSupport()
              onClose()
            }}
          />
          <a
            href="https://instagram.com/gianrufin"
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t px-4 py-2.5 text-center text-xs opacity-50 transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Made by Gian Rufin
          </a>
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <div className="border-t" style={{ borderColor: 'var(--border-color)' }} />
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
