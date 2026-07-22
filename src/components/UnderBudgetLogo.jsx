/** Minimal wordmark: a basket glyph + "UnderBudget" in a tight, premium set. */
export default function UnderBudgetLogo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        style={{ color: 'var(--accent-color)' }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 7h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 7Z" />
        <path d="M8 7V6a4 4 0 0 1 8 0v1" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">UnderBudget</span>
    </div>
  )
}
