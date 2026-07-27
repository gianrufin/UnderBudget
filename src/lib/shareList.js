/** Plain-text summary of the current cart, for the native share sheet or clipboard. */
export function buildShareText({ items, budget, spent, currency, fmt }) {
  const remaining = budget - spent
  const overBudget = remaining < 0
  const lines = [
    'UnderBudget — Grocery List',
    `Budget: ${fmt(budget)}`,
    `Spent: ${fmt(spent)}`,
    overBudget ? `Over budget by: ${fmt(Math.abs(remaining))}` : `Remaining: ${fmt(remaining)}`,
    '',
    ...items.map(
      (item) =>
        `${item.purchased ? '[x]' : '[ ]'} ${item.name} x${item.quantity} — ${fmt(item.price * item.quantity)}`,
    ),
  ]
  if (items.length === 0) lines.push('(no items yet)')
  return lines.join('\n')
}

/**
 * Share via the native share sheet where available, otherwise copy to the
 * clipboard. Returns which path was taken so the caller can show the right
 * toast (or none, if the user just cancelled the native share dialog).
 */
export async function shareOrCopy(text) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: 'UnderBudget', text })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
      // Fall through to clipboard if the share sheet itself failed.
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return 'copied'
  }
  return 'unsupported'
}
