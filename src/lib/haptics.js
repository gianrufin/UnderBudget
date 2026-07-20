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
