import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import UnderBudgetLogo from './UnderBudgetLogo'
import PersistentNumberPad from './PersistentNumberPad'
import CurrencyPicker from './CurrencyPicker'
import { useCurrency } from '../context/CurrencyContext'

/**
 * First-run state: a lightweight prompt for the grocery budget, using the
 * same persistent keypad as the main screen so the app feels consistent
 * from the very first interaction.
 */
export default function BudgetSetup({ onSubmit, onCurrencyChange }) {
  const { currency, symbol } = useCurrency()
  const [value, setValue] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (/^[0-9]$/.test(e.key)) setValue((v) => (v + e.key).slice(0, 10))
      else if (e.key === '.') setValue((v) => (v.includes('.') ? v : v + '.'))
      else if (e.key === 'Backspace') setValue((v) => v.slice(0, -1))
      else if (e.key === 'Enter') submit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function submit() {
    const amount = parseFloat(value)
    if (Number.isFinite(amount) && amount > 0) onSubmit(amount)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <UnderBudgetLogo className="mb-1" />
        <p className="mb-8 text-xs opacity-60">Stay aware. Spend within your limit.</p>

        <p className="mb-2 text-sm font-medium opacity-70">Set your grocery budget</p>
        <div
          className="mb-2 flex min-h-16 w-full max-w-xs items-center justify-center rounded-2xl border px-4 transition-colors duration-500"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
        >
          <span className="text-4xl font-bold tabular-nums">
            <span className="mr-1 opacity-50">{symbol}</span>
            {value || '0'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mb-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium opacity-70 active:scale-95"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {currency}
          <ChevronDown className="h-3 w-3" />
        </button>
        <p className="text-xs opacity-50">You can change this anytime.</p>
      </div>

      <CurrencyPicker
        open={pickerOpen}
        currency={currency}
        onSelect={onCurrencyChange}
        onClose={() => setPickerOpen(false)}
      />

      <PersistentNumberPad
        onDigit={(d) => setValue((v) => (v + d).slice(0, 10))}
        onDoubleZero={() => setValue((v) => (v ? (v + '00').slice(0, 10) : v))}
        onDecimal={() => setValue((v) => (v.includes('.') ? v : v + '.'))}
        onBackspace={() => setValue((v) => v.slice(0, -1))}
        onClear={() => setValue('')}
        onConfirm={submit}
        confirmLabel="Start"
        confirmDisabled={!(parseFloat(value) > 0)}
      />
    </div>
  )
}
