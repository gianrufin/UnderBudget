import { useEffect } from 'react'

/**
 * Applies the chosen theme ('system' | 'light' | 'dark') by toggling the
 * `dark` class on <html>, and keeps 'system' in sync with the OS preference.
 */
export function useTheme(theme) {
  useEffect(() => {
    const root = document.documentElement
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    function apply() {
      const dark = theme === 'dark' || (theme === 'system' && mql.matches)
      root.classList.toggle('dark', dark)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', dark ? '#020617' : '#ffffff')
    }

    apply()
    if (theme === 'system') {
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }
  }, [theme])
}
