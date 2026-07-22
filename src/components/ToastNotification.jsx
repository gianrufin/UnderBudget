import { useEffect } from 'react'
import { Undo2 } from 'lucide-react'

/** Transient status toast (item added, item deleted + undo, etc). */
export default function ToastNotification({ toast, onAction, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, toast.duration ?? 3500)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-30 flex justify-center px-4" aria-live="polite">
      <div
        className="pointer-events-auto flex max-w-xs items-center gap-3 rounded-full py-2 pl-4 pr-2.5 text-sm text-white shadow-lg motion-safe:animate-[fadeIn_0.15s_ease-out]"
        style={{ backgroundColor: 'var(--primary-button-color)' }}
      >
        <span className="truncate">{toast.message}</span>
        {toast.actionLabel && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-medium active:scale-95"
          >
            <Undo2 className="h-3.5 w-3.5" />
            {toast.actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
