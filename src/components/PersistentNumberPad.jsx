import { Delete, CornerDownLeft } from 'lucide-react'
import { tapHaptic } from '../lib/haptics'

/**
 * The defining interaction of UnderBudget: an always-visible calculator-style
 * keypad docked at the bottom of the screen. It never lives in a modal —
 * whatever field is "active" (price, quantity, or budget setup) receives its
 * input directly, so the user never has to reach for the native keyboard.
 */
export default function PersistentNumberPad({
  onDigit,
  onDoubleZero,
  onDecimal,
  onBackspace,
  onClear,
  onConfirm,
  confirmLabel = 'Add',
  confirmDisabled = false,
}) {
  function press(fn) {
    return () => {
      tapHaptic(6)
      fn()
    }
  }

  return (
    <div
      className="shrink-0 border-t px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-colors duration-500"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      role="group"
      aria-label="Number pad"
    >
      <div className="grid grid-cols-4 gap-2">
        <PadKey label="7" onClick={press(() => onDigit('7'))} />
        <PadKey label="8" onClick={press(() => onDigit('8'))} />
        <PadKey label="9" onClick={press(() => onDigit('9'))} />
        <PadKey label="Backspace" ariaLabel="Backspace" onClick={press(onBackspace)}>
          <Delete className="h-5 w-5" />
        </PadKey>

        <PadKey label="4" onClick={press(() => onDigit('4'))} />
        <PadKey label="5" onClick={press(() => onDigit('5'))} />
        <PadKey label="6" onClick={press(() => onDigit('6'))} />
        <PadKey label="Clear" ariaLabel="Clear" muted onClick={press(onClear)}>
          C
        </PadKey>

        <PadKey label="1" onClick={press(() => onDigit('1'))} />
        <PadKey label="2" onClick={press(() => onDigit('2'))} />
        <PadKey label="3" onClick={press(() => onDigit('3'))} />
        <PadKey label="Decimal point" ariaLabel="Decimal point" onClick={press(onDecimal)}>
          .
        </PadKey>

        <PadKey label="00" onClick={press(onDoubleZero)} />
        <PadKey label="0" onClick={press(() => onDigit('0'))} />
        <button
          type="button"
          onClick={press(onConfirm)}
          disabled={confirmDisabled}
          aria-label={confirmLabel}
          className="col-span-2 flex h-14 items-center justify-center gap-2 rounded-xl text-base font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          style={{ backgroundColor: 'var(--primary-button-color)' }}
        >
          <CornerDownLeft className="h-5 w-5" />
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

function PadKey({ label, ariaLabel, onClick, children, muted }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className="flex h-14 items-center justify-center rounded-xl border text-lg font-medium tabular-nums transition-transform active:scale-95"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: muted
          ? 'color-mix(in srgb, var(--border-color) 35%, transparent)'
          : 'color-mix(in srgb, var(--canvas-start) 55%, var(--surface-color))',
      }}
    >
      {children ?? label}
    </button>
  )
}
