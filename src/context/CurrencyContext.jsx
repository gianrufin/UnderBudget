import { createContext, useContext, useMemo } from 'react'
import { formatCurrency } from '../lib/format'
import { getCurrency } from '../lib/currencies'

const CurrencyContext = createContext({
  currency: 'PHP',
  symbol: '₱',
  fmt: (v) => formatCurrency(v),
})

export function CurrencyProvider({ currencyCode, children }) {
  const value = useMemo(() => {
    const { code, locale, symbol } = getCurrency(currencyCode)
    return {
      currency: code,
      symbol,
      fmt: (v) => formatCurrency(v, { currency: code, locale }),
    }
  }, [currencyCode])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

/** Access the active currency + a `fmt` helper bound to it. */
export function useCurrency() {
  return useContext(CurrencyContext)
}
