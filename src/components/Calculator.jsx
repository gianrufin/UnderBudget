import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, CornerDownLeft, Delete, History, X } from 'lucide-react'
import { evaluate, roundResult } from '../lib/calculator'
import { useCurrency } from '../context/CurrencyContext'
import { tapHaptic } from '../lib/haptics'

const OPERATOR_CHARS = ['+', '-', '*', '/']
const DISPLAY_OP = { '*': '×', '/': '÷', '-': '−', '+': '+' }

/**
 * Persistent calculator docked to the bottom. Always accessible; collapses to a
 * slim bar and expands to a full keypad. Supports keyboard entry, a running
 * history, percentage and sign toggle, and piping the result into a new item.
 */
export default function Calculator({
  collapsed,
  onToggle,
  onUsePrice,
  history,
  onPushHistory,
  onClearHistory,
}) {
  const { fmt } = useCurrency()
  const [expr, setExpr] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const result = useMemo(() => evaluate(expr), [expr])
  const rounded = result === null ? null : roundResult(result)
  const hasResult = rounded !== null && expr.trim() !== ''

  const append = useCallback((char) => {
    setExpr((prev) => {
      const last = prev.slice(-1)
      if (OPERATOR_CHARS.includes(char)) {
        if (prev === '') return char === '-' ? '-' : prev
        if (OPERATOR_CHARS.includes(last)) return prev.slice(0, -1) + char
        return prev + char
      }
      if (char === '.') {
        const segment = prev.split(/[+\-*/]/).pop()
        if (segment.includes('.')) return prev
        if (segment === '') return prev + '0.'
        return prev + '.'
      }
      return prev + char
    })
  }, [])

  const clearAll = useCallback(() => setExpr(''), [])
  const backspace = useCallback(() => setExpr((prev) => prev.slice(0, -1)), [])

  const equals = useCallback(() => {
    if (rounded === null || expr.trim() === '') return
    const value = String(rounded)
    if (value !== expr) onPushHistory({ expr, result: value, at: Date.now() })
    setExpr(value)
  }, [rounded, expr, onPushHistory])

  // Percentage: turn the current value into a fraction of 100.
  const percent = useCallback(() => {
    if (result === null) return
    setExpr(String(roundResult(result / 100)))
  }, [result])

  // Toggle the sign of the current value.
  const toggleSign = useCallback(() => {
    if (result === null) return
    setExpr(String(roundResult(-result)))
  }, [result])

  const usePrice = useCallback(() => {
    const value = evaluate(expr)
    if (value === null) return
    const priced = roundResult(Math.max(0, value), 2)
    onPushHistory({ expr: expr || String(priced), result: String(priced), at: Date.now() })
    onUsePrice(String(priced))
    setExpr('')
  }, [expr, onPushHistory, onUsePrice])

  // Physical keyboard support (desktop / bluetooth keyboards).
  useEffect(() => {
    if (collapsed) return
    function onKey(e) {
      const el = document.activeElement
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return
      const k = e.key
      if (/[0-9]/.test(k)) append(k)
      else if (k === '.') append('.')
      else if (k === '+' || k === '-' || k === '*' || k === '/') append(k)
      else if (k === 'Enter' || k === '=') { e.preventDefault(); equals() }
      else if (k === 'Backspace') { e.preventDefault(); backspace() }
      else if (k === 'Escape') clearAll()
      else if (k === '%') percent()
      else return
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [collapsed, append, equals, backspace, clearAll, percent])

  function press(fn) {
    return () => {
      tapHaptic()
      fn()
    }
  }

  const prettyExpr = expr.replace(/[+\-*/]/g, (m) => ` ${DISPLAY_OP[m]} `).trim()

  return (
    <section className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto w-full max-w-md px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {/* Display / handle row */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 py-1 text-left"
            aria-label={collapsed ? 'Expand calculator' : 'Collapse calculator'}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-slate-400 tabular-nums">
                {prettyExpr || 'Calculator'}
              </div>
              <div className="truncate text-2xl font-semibold text-slate-900 tabular-nums dark:text-white">
                {hasResult ? rounded : prettyExpr ? '…' : '0'}
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
          {!collapsed && (
            <button
              onClick={() => setShowHistory((s) => !s)}
              className={`shrink-0 rounded-full p-2 transition active:scale-90 ${
                showHistory
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                  : 'text-slate-400'
              }`}
              aria-label="Calculation history"
            >
              <History className="h-5 w-5" />
            </button>
          )}
        </div>

        {!collapsed && showHistory && (
          <div className="mb-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                History
              </span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-xs text-slate-400 active:text-red-500"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="px-1 py-2 text-sm text-slate-400">No calculations yet.</p>
            ) : (
              <ul className="max-h-32 overflow-y-auto">
                {history.map((h, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        setExpr(h.result)
                        setShowHistory(false)
                      }}
                      className="flex w-full items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-left active:bg-slate-100 dark:active:bg-slate-800"
                    >
                      <span className="truncate text-sm text-slate-400 tabular-nums">
                        {h.expr.replace(/[+\-*/]/g, (m) => ` ${DISPLAY_OP[m]} `)}
                      </span>
                      <span className="shrink-0 font-medium text-slate-700 tabular-nums dark:text-slate-200">
                        {h.result}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!collapsed && (
          <>
            <button
              onClick={press(usePrice)}
              disabled={!hasResult}
              className="mb-2 mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/30 transition active:scale-[0.98] active:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
            >
              <CornerDownLeft className="h-4 w-4" />
              Use {hasResult ? fmt(roundResult(Math.max(0, rounded), 2)) : 'result'} as price
            </button>

            <div className="grid grid-cols-4 gap-2">
              <Key onClick={press(clearAll)} variant="function">AC</Key>
              <Key onClick={press(toggleSign)} variant="function" aria-label="Toggle sign">±</Key>
              <Key onClick={press(percent)} variant="function" aria-label="Percent">%</Key>
              <Key onClick={press(() => append('/'))} variant="operator">÷</Key>

              <Key onClick={press(() => append('7'))}>7</Key>
              <Key onClick={press(() => append('8'))}>8</Key>
              <Key onClick={press(() => append('9'))}>9</Key>
              <Key onClick={press(() => append('*'))} variant="operator">×</Key>

              <Key onClick={press(() => append('4'))}>4</Key>
              <Key onClick={press(() => append('5'))}>5</Key>
              <Key onClick={press(() => append('6'))}>6</Key>
              <Key onClick={press(() => append('-'))} variant="operator">−</Key>

              <Key onClick={press(() => append('1'))}>1</Key>
              <Key onClick={press(() => append('2'))}>2</Key>
              <Key onClick={press(() => append('3'))}>3</Key>
              <Key onClick={press(() => append('+'))} variant="operator">+</Key>

              <Key onClick={press(backspace)} variant="function" aria-label="Backspace">
                <Delete className="mx-auto h-5 w-5" />
              </Key>
              <Key onClick={press(() => append('0'))}>0</Key>
              <Key onClick={press(() => append('.'))}>.</Key>
              <Key onClick={press(equals)} variant="equals">=</Key>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Key({ children, onClick, variant = 'number', className = '', ...rest }) {
  const styles = {
    number:
      'bg-slate-100 text-slate-900 active:bg-slate-200 dark:bg-slate-800 dark:text-white dark:active:bg-slate-700',
    function:
      'bg-slate-200 text-slate-600 active:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:active:bg-slate-600',
    operator:
      'bg-slate-900 text-white active:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:active:bg-white',
    equals:
      'bg-emerald-500 text-white active:bg-emerald-600 shadow-sm shadow-emerald-500/30',
  }
  return (
    <button
      onClick={onClick}
      className={`h-14 rounded-2xl text-xl font-medium tabular-nums transition active:scale-95 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
