import { createContext, useContext, useMemo } from 'react'
import { formatCurrency } from '../lib/format'
import { currencySymbol } from '../lib/currencies'

const CurrencyContext = createContext({
  currency: 'USD',
  symbol: '$',
  fmt: (v) => formatCurrency(v),
})

export function CurrencyProvider({ currency, children }) {
  const value = useMemo(
    () => ({
      currency,
      symbol: currencySymbol(currency),
      fmt: (v) => formatCurrency(v, { currency }),
    }),
    [currency],
  )
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

/** Access the active currency + a `fmt` helper bound to it. */
export function useCurrency() {
  return useContext(CurrencyContext)
}
