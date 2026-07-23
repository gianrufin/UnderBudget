import { Coffee } from 'lucide-react'

/** A lightweight "buy me a coffee" screen — scan-to-tip via GCash/InstaPay. */
export default function SupportDialog({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Support UnderBudget"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-2xl border p-5 text-center shadow-xl sm:max-w-sm sm:rounded-2xl"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
      >
        <div
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-color)' }}
        >
          <Coffee className="h-5 w-5" />
        </div>

        <h2 className="mt-3 text-base font-semibold">Buy me a coffee</h2>
        <p className="mx-auto mt-1.5 max-w-[30ch] text-sm opacity-70">
          UnderBudget is free and built solo. If it's helped you stay on budget, a small tip means
          a lot.
        </p>

        <div
          className="mx-auto mt-5 w-full max-w-[240px] rounded-xl border p-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: '#ffffff' }}
        >
          <img
            src={`${import.meta.env.BASE_URL}gcash-qr.jpg`}
            alt="GCash / InstaPay QR code to send a donation to Gian Rufin"
            className="w-full rounded-lg"
          />
        </div>
        <p className="mt-3 text-xs font-medium opacity-70">Scan with GCash to send a tip</p>
        <p className="mt-1 text-xs opacity-50">Any amount is appreciated. Thank you.</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border py-2.5 text-sm font-medium active:scale-95"
          style={{ borderColor: 'var(--border-color)' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
