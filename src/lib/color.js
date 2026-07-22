/**
 * Full-canvas budget color system.
 *
 * The whole interface (canvas gradient, surfaces, borders, glow, progress
 * bar, and accent buttons) is driven by a single number: how much of the
 * budget has been spent. This module turns that ratio into a set of CSS
 * custom properties by interpolating between hand-picked color stops.
 */

export const STATUS_STOPS = [
  { max: 0.4, label: 'Comfortable' },
  { max: 0.65, label: 'On track' },
  { max: 0.8, label: 'Be mindful' },
  { max: 0.95, label: 'Near your limit' },
  { max: 1.0, label: 'Almost at budget' },
  { max: Infinity, label: 'Over budget' },
]

export function budgetStatus(ratio) {
  return STATUS_STOPS.find((s) => ratio <= s.max)?.label ?? 'Over budget'
}

// Cap the ratio used for *visual* interpolation so an extreme overspend
// doesn't wash out into a single flat color — it settles into "deep crimson".
const VISUAL_CAP = 1.15

export function clampVisualRatio(ratio) {
  if (!Number.isFinite(ratio) || ratio < 0) return 0
  return Math.min(ratio, VISUAL_CAP)
}

// Each stop defines every surface at a given point on the 0 -> 1.15 scale.
const LIGHT_STOPS = [
  { t: 0.0, canvasStart: '#f2fbf6', canvasEnd: '#fbfaf0', surface: '#ffffff', accent: '#0ea472', progress: '#0ea472', border: '#a7e8cd', glow: 'rgba(14,164,114,0.20)', warning: '#047857' },
  { t: 0.4, canvasStart: '#f0fdf4', canvasEnd: '#fefce8', surface: '#ffffff', accent: '#22c55e', progress: '#22c55e', border: '#bbf0c9', glow: 'rgba(34,197,94,0.22)', warning: '#15803d' },
  { t: 0.65, canvasStart: '#fefce8', canvasEnd: '#fff7ed', surface: '#fffdf7', accent: '#d69e0a', progress: '#eab308', border: '#f5df9b', glow: 'rgba(234,179,8,0.28)', warning: '#a16207' },
  { t: 0.8, canvasStart: '#fff7ed', canvasEnd: '#fff0ea', surface: '#fffaf5', accent: '#ea7c14', progress: '#f97316', border: '#f7c493', glow: 'rgba(249,115,22,0.32)', warning: '#c2410c' },
  { t: 0.95, canvasStart: '#fff0ea', canvasEnd: '#fee4e2', surface: '#fff8f6', accent: '#e13f3f', progress: '#ef4444', border: '#f5aca9', glow: 'rgba(239,68,68,0.36)', warning: '#b91c1c' },
  { t: 1.0, canvasStart: '#fee4e2', canvasEnd: '#fdd2ce', surface: '#fff5f4', accent: '#dc2626', progress: '#dc2626', border: '#f1928d', glow: 'rgba(220,38,38,0.4)', warning: '#991b1b' },
  { t: 1.15, canvasStart: '#fdd2ce', canvasEnd: '#f6b2ab', surface: '#fff1ef', accent: '#b91c1c', progress: '#b91c1c', border: '#e8756e', glow: 'rgba(185,28,28,0.45)', warning: '#7f1d1d' },
]

const DARK_STOPS = [
  { t: 0.0, canvasStart: '#050505', canvasEnd: '#061f16', surface: '#0b0f0d', accent: '#22c98a', progress: '#22c98a', border: '#12362a', glow: 'rgba(34,201,138,0.22)', warning: '#6ee7b7' },
  { t: 0.4, canvasStart: '#050505', canvasEnd: '#052e14', surface: '#0a0f0b', accent: '#34d167', progress: '#34d167', border: '#164229', glow: 'rgba(52,209,103,0.24)', warning: '#86efac' },
  { t: 0.65, canvasStart: '#080604', canvasEnd: '#2b2206', surface: '#100d08', accent: '#e0b429', progress: '#eab308', border: '#4a3a0c', glow: 'rgba(234,179,8,0.28)', warning: '#fde047' },
  { t: 0.8, canvasStart: '#0a0503', canvasEnd: '#391906', surface: '#120c08', accent: '#f2892c', progress: '#f97316', border: '#5c2c0c', glow: 'rgba(249,115,22,0.34)', warning: '#fdba74' },
  { t: 0.95, canvasStart: '#0c0303', canvasEnd: '#440a0a', surface: '#140909', accent: '#f2504f', progress: '#ef4444', border: '#6b1616', glow: 'rgba(239,68,68,0.4)', warning: '#fca5a5' },
  { t: 1.0, canvasStart: '#0c0202', canvasEnd: '#560a0a', surface: '#160808', accent: '#f4544f', progress: '#ef4444', border: '#7a1616', glow: 'rgba(239,68,68,0.46)', warning: '#fecaca' },
  { t: 1.15, canvasStart: '#0c0202', canvasEnd: '#6e0909', surface: '#180707', accent: '#f87171', progress: '#f87171', border: '#8f1a1a', glow: 'rgba(248,113,113,0.55)', warning: '#fee2e2' },
]

function parseColor(input) {
  if (input.startsWith('#')) {
    const hex = input.slice(1)
    const bigint = parseInt(hex, 16)
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 1]
  }
  const m = input.match(/rgba?\(([^)]+)\)/)
  const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n))
  return [r, g, b, a]
}

function lerp(a, b, f) {
  return a + (b - a) * f
}

function mixColor(c1, c2, f) {
  const [r1, g1, b1, a1] = parseColor(c1)
  const [r2, g2, b2, a2] = parseColor(c2)
  const r = Math.round(lerp(r1, r2, f))
  const g = Math.round(lerp(g1, g2, f))
  const b = Math.round(lerp(b1, b2, f))
  const a = lerp(a1, a2, f)
  return a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
}

const KEYS = ['canvasStart', 'canvasEnd', 'surface', 'accent', 'progress', 'border', 'glow', 'warning']

/**
 * Interpolate every surface color for the given ratio and color scheme.
 * Returns a flat object of CSS custom-property values (no leading `--`).
 */
export function getBudgetColors(ratio, isDark) {
  const stops = isDark ? DARK_STOPS : LIGHT_STOPS
  const t = clampVisualRatio(ratio)

  let lower = stops[0]
  let upper = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      lower = stops[i]
      upper = stops[i + 1]
      break
    }
  }
  const span = upper.t - lower.t
  const f = span === 0 ? 0 : (t - lower.t) / span

  const result = {}
  for (const key of KEYS) {
    result[key] = mixColor(lower[key], upper[key], f)
  }
  return result
}
