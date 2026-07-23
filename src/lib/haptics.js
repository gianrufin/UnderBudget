/** Fire a tiny haptic tap where supported (mobile). No-op otherwise. */
export function tapHaptic(ms = 8) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms)
    }
  } catch {
    // Ignore — vibration is a progressive enhancement.
  }
}

/** A more noticeable double-buzz for budget status changes (e.g. crossing into "Over budget"). */
export function statusChangeHaptic() {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([18, 60, 18])
    }
  } catch {
    // Ignore — vibration is a progressive enhancement.
  }
}
