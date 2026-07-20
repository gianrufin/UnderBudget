import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { toNumber } from '../lib/format'

const EMPTY = { name: '', price: '', quantity: 1 }

/**
 * Bottom-sheet form for creating or editing an item.
 *
 * @param {object|null} editingItem  Item being edited, or null when adding.
 * @param {string} prefillPrice      Price piped in from the calculator.
 */
export default function ItemFormSheet({
  open,
  editingItem,
  prefillPrice,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY)
  const nameRef = useRef(null)

  // Populate the form whenever the sheet opens.
  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        name: editingItem.name,
        price: String(editingItem.price),
        quantity: editingItem.quantity,
      })
    } else {
      setForm({ ...EMPTY, price: prefillPrice ?? '' })
    }
  }, [open, editingItem, prefillPrice])

  // Focus the name field on open (mobile-friendly).
  useEffect(() => {
    if (open && !editingItem) {
      const t = setTimeout(() => nameRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [open, editingItem])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const quantity = Math.max(1, toNumber(form.quantity) || 1)

  function setQuantity(next) {
    setForm((f) => ({ ...f, quantity: Math.max(1, next) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name && !form.price) {
      onClose()
      return
    }
    onSubmit({
      id: editingItem?.id,
      name: name || 'Untitled item',
      price: toNumber(form.price),
      quantity,
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
      />

      {/* Sheet */}
      <div className="relative mx-auto w-full max-w-md rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl animate-[slideUp_0.2s_ease-out] dark:bg-slate-900">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {editingItem ? 'Edit item' : 'New item'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 active:bg-slate-100 dark:active:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Name
            </span>
            <input
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Olive oil"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-900/40"
            />
          </label>

          <div className="flex gap-3">
            <label className="block flex-1">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Price
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:ring-emerald-900/40">
                <span className="text-slate-400">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-transparent py-3 pl-1.5 text-slate-900 outline-none placeholder:text-slate-300 dark:text-white"
                />
              </div>
            </label>

            <div className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Qty
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  className="p-3 text-slate-500 active:scale-90 dark:text-slate-400"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.round(toNumber(e.target.value)))}
                  className="w-10 bg-transparent py-3 text-center font-medium text-slate-900 outline-none tabular-nums dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-slate-500 active:scale-90 dark:text-slate-400"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-emerald-500 py-3.5 font-semibold text-white shadow-sm shadow-emerald-500/30 active:scale-[0.98] active:bg-emerald-600"
          >
            {editingItem ? 'Save changes' : 'Add to list'}
          </button>
        </form>
      </div>
    </div>
  )
}
