/**
 * Full-canvas gradient wrapper. On desktop/tablet the app is presented as a
 * centered, phone-like column rather than stretched edge to edge — the
 * gradient itself still fills the whole viewport so the "heating up" effect
 * reads at any size.
 */
export default function AppShell({ children }) {
  return (
    <div
      className="min-h-dvh w-full transition-colors duration-500 motion-reduce:transition-none"
      style={{ background: 'linear-gradient(180deg, var(--canvas-start), var(--canvas-end))' }}
    >
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden sm:py-4">
        <div
          className="flex h-full w-full flex-col overflow-hidden text-[15px] text-slate-900 transition-colors duration-500 motion-reduce:transition-none sm:rounded-3xl sm:border sm:shadow-xl dark:text-white"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
