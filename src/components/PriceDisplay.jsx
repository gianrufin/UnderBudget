import { forwardRef } from 'react'
import { useCurrency } from '../context/CurrencyContext'

/**
 * The primary numeric field. It's read-only so mobile browsers never pop the
 * native keyboard — all input comes from PersistentNumberPad (or a physical
 * keyboard, handled globally while this field is active).
 */
const PriceDisplay = forwardRef(function PriceDisplay({ value, active, onFocus }, ref) {
  const { symbol, currency } = useCurrency()
  return (
    <div className="flex-1">
      <label htmlFor="price-field" className="mb-1 block text-xs font-medium opacity-60">
        Price ({symbol})
      </label>
      <input
        id="price-field"
        ref={ref}
        type="text"
        inputMode="none"
        readOnly
        value={value}
        onFocus={onFocus}
        onClick={onFocus}
        placeholder="0"
        aria-label={`Price: ${value || '0'} ${currency}. Use the number pad to edit.`}
        className="w-full rounded-lg border px-3 py-2.5 text-right text-lg font-semibold tabular-nums outline-none transition-colors"
        style={{
          borderColor: active ? 'var(--accent-color)' : 'var(--border-color)',
          backgroundColor: 'var(--surface-color)',
          boxShadow: active ? '0 0 0 2px var(--glow-color)' : 'none',
        }}
      />
    </div>
  )
})

export default PriceDisplay
