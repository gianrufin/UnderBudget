import { useEffect, useMemo } from 'react'
import { getBudgetColors, budgetStatus, clampVisualRatio } from '../lib/color'

/**
 * Interpolates the full-canvas budget theme for the current spend ratio and
 * writes it to CSS custom properties on <html> so every surface (canvas,
 * cards, borders, progress bar, accents) can reference `var(--*)` and
 * transition together.
 */
export function useBudgetColors(ratio, isDark) {
  const colors = useMemo(() => getBudgetColors(ratio, isDark), [ratio, isDark])
  const status = useMemo(() => budgetStatus(ratio), [ratio])
  const visualRatio = useMemo(() => clampVisualRatio(ratio), [ratio])

  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--canvas-start', colors.canvasStart)
    root.setProperty('--canvas-end', colors.canvasEnd)
    root.setProperty('--surface-color', colors.surface)
    root.setProperty('--accent-color', colors.accent)
    root.setProperty('--progress-color', colors.progress)
    root.setProperty('--border-color', colors.border)
    root.setProperty('--glow-color', colors.glow)
    root.setProperty('--warning-color', colors.warning)
    root.setProperty('--primary-button-color', colors.accent)

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', colors.canvasStart)
  }, [colors])

  return { colors, status, visualRatio }
}
