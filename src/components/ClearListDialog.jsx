export default function ClearListDialog({ open, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="clear-dialog-title"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-xl border p-5 shadow-xl"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        <h2 id="clear-dialog-title" className="text-sm font-semibold">
          Clear all items?
        </h2>
        <p className="mt-1 text-xs opacity-60">This removes every item from your current list. This can't be undone.</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border py-2.5 text-sm font-medium active:scale-95"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white active:scale-95"
            style={{ backgroundColor: 'var(--warning-color)' }}
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
