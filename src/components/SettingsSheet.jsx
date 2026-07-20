import { useRef } from 'react'
import { Download, Monitor, Moon, Sun, Trash2, Upload } from 'lucide-react'
import Sheet from './Sheet'
import { CURRENCIES } from '../lib/currencies'

/** App settings: currency, theme, data export/import, and full reset. */
export default function SettingsSheet({
  open,
  settings,
  onClose,
  onCurrencyChange,
  onThemeChange,
  onExport,
  onImport,
  onReset,
}) {
  const fileRef = useRef(null)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        onImport(JSON.parse(String(reader.result)))
      } catch {
        window.alert('That file could not be imported.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <Sheet open={open} title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Currency */}
        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Currency
          </h3>
          <div className="relative">
            <select
              value={settings.currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-900 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} · {c.code} — {c.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Theme */}
        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(({ value, label, icon: Icon }) => {
              const active = settings.theme === value
              return (
                <button
                  key={value}
                  onClick={() => onThemeChange(value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-medium transition ${
                    active
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Data */}
        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Data
          </h3>
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 active:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 active:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFile}
              className="hidden"
            />
          </div>
          <button
            onClick={() => {
              if (window.confirm('Erase all lists, items and settings?')) onReset()
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 active:bg-red-50 dark:border-red-950 dark:active:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" />
            Reset everything
          </button>
        </section>

        <p className="text-center text-xs text-slate-400">
          UnderBudget · data stays on this device
        </p>
      </div>
    </Sheet>
  )
}
