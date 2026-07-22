import { Sun, Moon, MonitorSmartphone } from 'lucide-react'

const NEXT = { light: 'dark', dark: 'system', system: 'light' }
const ICONS = { light: Sun, dark: Moon, system: MonitorSmartphone }
const LABELS = { light: 'Light mode', dark: 'Dark mode', system: 'System theme' }

/** Cycles light -> dark -> system on tap. Compact, header-friendly. */
export default function ThemeToggle({ theme, onChange }) {
  const Icon = ICONS[theme] ?? Sun

  return (
    <button
      type="button"
      onClick={() => onChange(NEXT[theme] ?? 'light')}
      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors active:scale-95"
      style={{ borderColor: 'var(--border-color)', color: 'var(--accent-color)' }}
      aria-label={`Theme: ${LABELS[theme] ?? theme}. Tap to change.`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  )
}
