import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

/**
 * One-tap shortcuts for prices used recently — handy for repeat items like
 * eggs or bread. Only shown while the price field is empty and active, so it
 * never competes with the keypad once the user starts typing.
 */
export default function RecentPriceChips({ prices, onPick }) {
  if (!prices.length) return null
  const { fmt } = useCurrency()

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto px-3 pb-1.5 pt-2" aria-label="Recent prices">
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide opacity-50">Recent</span>
      {prices.map((price) => (
        <button
          key={price}
          type="button"
          onClick={() => {
            tapHaptic(6)
            onPick(price)
          }}
          className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-transform active:scale-95"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
        >
          {fmt(price)}
        </button>
      ))}
    </div>
  )
}
