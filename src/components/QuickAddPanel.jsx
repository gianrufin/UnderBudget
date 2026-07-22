import { Plus } from 'lucide-react'
import ItemNameInput from './ItemNameInput'
import PriceDisplay from './PriceDisplay'
import QuantityInput from './QuantityInput'

export default function QuickAddPanel({
  nameRef,
  priceRef,
  qtyRef,
  itemName,
  price,
  quantity,
  activeInput,
  onNameChange,
  onNameSubmit,
  onFocusField,
  onAdd,
  canAdd,
  editing,
}) {
  return (
    <div className="border-t px-3 pb-2 pt-3 transition-colors duration-500" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-end gap-2">
        <ItemNameInput ref={nameRef} value={itemName} onChange={onNameChange} onSubmit={onNameSubmit} />
        <PriceDisplay
          ref={priceRef}
          value={price}
          active={activeInput === 'price'}
          onFocus={() => onFocusField('price')}
        />
        <QuantityInput
          ref={qtyRef}
          value={quantity}
          active={activeInput === 'quantity'}
          onFocus={() => onFocusField('quantity')}
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          aria-label={editing ? 'Save item' : 'Add item to list'}
          className="flex h-[42px] shrink-0 items-center gap-1 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          style={{ backgroundColor: 'var(--primary-button-color)' }}
        >
          {editing ? 'Save' : 'Add'}
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
