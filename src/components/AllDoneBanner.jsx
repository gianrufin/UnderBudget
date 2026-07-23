import { PartyPopper } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

/** Shown once every item on the list has been marked purchased. */
export default function AllDoneBanner({ spent, budget }) {
  const { fmt } = useCurrency()
  const remaining = budget - spent
  const overBudget = remaining < 0

  return (
    <div
      className="mx-4 mt-3 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-500"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--glow-color)' }}
      role="status"
    >
      <PartyPopper className="h-5 w-5 shrink-0" style={{ color: 'var(--accent-color)' }} />
      <div className="min-w-0">
        <p className="text-sm font-semibold">All items purchased</p>
        <p className="text-xs opacity-70">
          Final total {fmt(spent)}
          {overBudget ? `, ${fmt(Math.abs(remaining))} over budget` : `, ${fmt(remaining)} left unspent`}
        </p>
      </div>
    </div>
  )
}
