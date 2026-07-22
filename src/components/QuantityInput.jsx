import { forwardRef } from 'react'

/** Secondary numeric field, same read-only + persistent-keypad pattern as price. */
const QuantityInput = forwardRef(function QuantityInput({ value, active, onFocus }, ref) {
  return (
    <div className="w-20 shrink-0">
      <label htmlFor="qty-field" className="mb-1 block text-xs font-medium opacity-60">
        Qty
      </label>
      <input
        id="qty-field"
        ref={ref}
        type="text"
        inputMode="none"
        readOnly
        value={value}
        onFocus={onFocus}
        onClick={onFocus}
        placeholder="1"
        aria-label={`Quantity: ${value || '1'}. Use the number pad to edit.`}
        className="w-full rounded-lg border px-2 py-2.5 text-center text-lg font-semibold tabular-nums outline-none transition-colors"
        style={{
          borderColor: active ? 'var(--accent-color)' : 'var(--border-color)',
          backgroundColor: 'var(--surface-color)',
          boxShadow: active ? '0 0 0 2px var(--glow-color)' : 'none',
        }}
      />
    </div>
  )
})

export default QuantityInput
