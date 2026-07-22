/**
 * Format a number as a currency string. Defaults to Philippine peso, kept
 * modular via `currency`/`locale` so more currencies can be added later.
 */
export function formatCurrency(value, { currency = 'PHP', locale = 'en-PH' } = {}) {
  const amount = Number.isFinite(value) ? value : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `₱${amount.toFixed(2)}`
  }
}

/** Coerce arbitrary input into a non-negative finite number (0 on failure). */
export function toNumber(input) {
  const n = typeof input === 'number' ? input : parseFloat(input)
  return Number.isFinite(n) ? n : 0
}

/** Clamp a value between min and max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
