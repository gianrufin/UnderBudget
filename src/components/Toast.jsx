import { useEffect } from 'react'
import { Undo2 } from 'lucide-react'

/** Transient bottom toast with an optional action (used for undo-delete). */
export default function Toast({ toast, onAction, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, toast.duration ?? 5000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-slate-900 py-2.5 pl-4 pr-2.5 text-sm text-white shadow-lg animate-[fadeIn_0.15s_ease-out] dark:bg-slate-700">
        <span className="truncate">{toast.message}</span>
        {toast.actionLabel && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-medium active:scale-95"
          >
            <Undo2 className="h-3.5 w-3.5" />
            {toast.actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
