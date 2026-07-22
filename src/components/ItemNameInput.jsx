import { forwardRef } from 'react'

/**
 * The one field that uses the device's native keyboard. Pressing
 * Enter/Go moves focus straight to the price field so the flow never stalls.
 */
const ItemNameInput = forwardRef(function ItemNameInput(
  { value, onChange, onSubmit },
  ref,
) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor="item-name" className="mb-1 block text-xs font-medium opacity-60">
        Item <span className="opacity-60">(optional)</span>
      </label>
      <input
        id="item-name"
        ref={ref}
        type="text"
        enterKeyHint="next"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit()
          }
        }}
        placeholder="e.g. Rice"
        aria-label="Item name (optional)"
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      />
    </div>
  )
})

export default ItemNameInput
