import { useEffect, useState } from 'react'

/**
 * Applies the chosen theme ('system' | 'light' | 'dark') by toggling the
 * `dark` class on <html>, keeps 'system' in sync with the OS preference, and
 * returns whether dark mode is currently active (for the color system).
 */
export function useTheme(theme) {
  const [isDark, setIsDark] = useState(() =>
    typeof window === 'undefined'
      ? false
      : theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )

  useEffect(() => {
    const root = document.documentElement
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    function apply() {
      const dark = theme === 'dark' || (theme === 'system' && mql.matches)
      root.classList.toggle('dark', dark)
      setIsDark(dark)
    }

    apply()
    if (theme === 'system') {
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }
  }, [theme])

  return isDark
}
