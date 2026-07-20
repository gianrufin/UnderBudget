/**
 * Format a number as a currency string. Defaults to USD but the symbol is the
 * only user-facing piece, so contexts (travel, projects) can swap it later.
 */
export function formatCurrency(value, { currency = 'USD', locale } = {}) {
  const amount = Number.isFinite(value) ? value : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
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
