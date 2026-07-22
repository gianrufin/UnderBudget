/** Thin, full-width progress bar tinted by the current budget color stage. */
export default function BudgetProgress({ percent }) {
  const width = Math.min(Math.max(percent, 0), 100)
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: 'color-mix(in srgb, var(--border-color) 60%, transparent)' }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Budget used"
    >
      <div
        className="h-full rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${width}%`, backgroundColor: 'var(--progress-color)' }}
      />
    </div>
  )
}
