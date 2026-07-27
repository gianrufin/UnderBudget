import { useRef, useState } from 'react'
import { Pencil, Trash2, Check, Minus, Plus } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

const SWIPE_TRIGGER = 64
const SWIPE_MAX = 96

export default function GroceryItemRow({ item, isNew, onToggle, onEdit, onDelete, onAdjustQuantity }) {
  const { fmt: formatCurrency } = useCurrency()
  const subtotal = item.price * item.quantity

  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const gestureRef = useRef(null)
  // A drag that starts on a child button (the checkbox often sits right where
  // the gesture begins) still ends with mousedown/up on that same button, so
  // the browser fires a native click on it too. Swallow exactly one click
  // whenever a horizontal drag happened, so it can't also toggle/act.
  const suppressClickRef = useRef(false)

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    gestureRef.current = { startX: e.clientX, startY: e.clientY, axis: null }
  }

  function onPointerMove(e) {
    const g = gestureRef.current
    if (!g) return
    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (g.axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      g.axis = Math.abs(dx) > Math.abs(dy) * 1.4 ? 'x' : 'y'
      if (g.axis === 'x') setDragging(true)
    }
    if (g.axis !== 'x') return
    setDragX(Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, dx)))
  }

  function endGesture() {
    const g = gestureRef.current
    gestureRef.current = null
    setDragging(false)
    if (g?.axis === 'x') {
      suppressClickRef.current = true
      if (dragX <= -SWIPE_TRIGGER) {
        tapHaptic(10)
        onDelete(item)
      } else if (dragX >= SWIPE_TRIGGER) {
        tapHaptic(10)
        onToggle(item.id)
      }
    }
    setDragX(0)
  }

  function onClickCapture(e) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <li
      className={`relative overflow-hidden border-b transition-colors duration-500 ${
        isNew ? 'motion-safe:animate-[itemIn_0.3s_ease-out]' : ''
      }`}
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div
        className="absolute inset-0 flex items-center justify-start gap-2 pl-5 text-white transition-opacity"
        style={{ backgroundColor: 'var(--accent-color)', opacity: dragX > 0 ? 1 : 0 }}
        aria-hidden="true"
      >
        <Check className="h-4 w-4" />
        <span className="text-xs font-semibold">{item.purchased ? 'Not purchased' : 'Purchased'}</span>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-end gap-2 pr-5 text-white transition-opacity"
        style={{ backgroundColor: 'var(--warning-color)', opacity: dragX < 0 ? 1 : 0 }}
        aria-hidden="true"
      >
        <Trash2 className="h-4 w-4" />
        <span className="text-xs font-semibold">Delete</span>
      </div>

      <div
        className="relative flex items-center gap-3 px-4 py-3"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 200ms ease-out',
          backgroundColor: 'var(--surface-color)',
          touchAction: 'pan-y',
        }}
        onClickCapture={onClickCapture}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          aria-pressed={item.purchased}
          aria-label={item.purchased ? `Mark ${item.name} as not purchased` : `Mark ${item.name} as purchased`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-95"
          style={{
            borderColor: item.purchased ? 'var(--accent-color)' : 'var(--border-color)',
            backgroundColor: item.purchased ? 'var(--accent-color)' : 'transparent',
          }}
        >
          {item.purchased && <Check className="h-4 w-4 text-white" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className={`truncate text-sm font-medium ${item.purchased ? 'opacity-40 line-through' : ''}`}>
              {item.name}
            </p>
            <p className={`shrink-0 text-sm font-semibold tabular-nums ${item.purchased ? 'opacity-40' : ''}`}>
              {formatCurrency(subtotal)}
            </p>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="shrink-0 text-xs tabular-nums opacity-50">{formatCurrency(item.price)} each</p>

            <div className="flex shrink-0 items-center gap-1.5">
              <div
                className="flex items-center rounded-md border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <StepButton
                  label={`Decrease quantity of ${item.name}`}
                  disabled={item.quantity <= 1}
                  onClick={() => {
                    tapHaptic(6)
                    onAdjustQuantity(item.id, -1)
                  }}
                >
                  <Minus className="h-3 w-3" />
                </StepButton>
                <span className="w-6 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                <StepButton
                  label={`Increase quantity of ${item.name}`}
                  onClick={() => {
                    tapHaptic(6)
                    onAdjustQuantity(item.id, 1)
                  }}
                >
                  <Plus className="h-3 w-3" />
                </StepButton>
              </div>

              <IconButton label={`Edit ${item.name}`} onClick={() => onEdit(item)}>
                <Pencil className="h-4 w-4" />
              </IconButton>
              <IconButton label={`Delete ${item.name}`} onClick={() => onDelete(item)}>
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

function StepButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center opacity-70 transition-transform active:scale-90 disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg opacity-60 transition-transform hover:opacity-100 active:scale-90"
    >
      {children}
    </button>
  )
}
