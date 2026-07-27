// Module-level switch so leaf components (keypad keys, chips, etc.) can call
// tapHaptic()/statusChangeHaptic() without threading a settings prop through
// every layer. App syncs this from the persisted `hapticsEnabled` setting.
let enabled = true

export function setHapticsEnabled(value) {
  enabled = value
}

/** Fire a tiny haptic tap where supported (mobile). No-op otherwise. */
export function tapHaptic(ms = 8) {
  if (!enabled) return
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
  if (!enabled) return
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([18, 60, 18])
    }
  } catch {
    // Ignore — vibration is a progressive enhancement.
  }
}
