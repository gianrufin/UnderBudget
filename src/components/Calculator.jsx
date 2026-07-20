import { useMemo, useState } from 'react'
import { ChevronDown, CornerDownLeft, Delete } from 'lucide-react'
import { evaluate, roundResult } from '../lib/calculator'
import { formatCurrency } from '../lib/format'

const OPERATOR_CHARS = ['+', '-', '*', '/']
const DISPLAY_OP = { '*': '×', '/': '÷', '-': '−', '+': '+' }

/**
 * Persistent calculator docked to the bottom of the screen. Always accessible;
 * collapses to a slim bar to give the list room, expands to a full keypad.
 * The live result can be piped straight into a new item's price.
 */
export default function Calculator({ collapsed, onToggle, onUsePrice }) {
  const [expr, setExpr] = useState('')

  const result = useMemo(() => evaluate(expr), [expr])
  const rounded = result === null ? null : roundResult(result)
  const hasResult = rounded !== null && expr.trim() !== ''

  function append(char) {
    setExpr((prev) => {
      const last = prev.slice(-1)

      // Operators: don't allow a leading operator (except minus), and replace a
      // trailing operator instead of stacking them.
      if (OPERATOR_CHARS.includes(char)) {
        if (prev === '') return char === '-' ? '-' : prev
        if (OPERATOR_CHARS.includes(last)) return prev.slice(0, -1) + char
        return prev + char
      }

      // Decimal: only one per number segment.
      if (char === '.') {
        const segment = prev.split(/[+\-*/]/).pop()
        if (segment.includes('.')) return prev
        if (segment === '') return prev + '0.'
        return prev + '.'
      }

      return prev + char
    })
  }

  function clearAll() {
    setExpr('')
  }

  function backspace() {
    setExpr((prev) => prev.slice(0, -1))
  }

  function equals() {
    if (rounded === null) return
    setExpr(String(rounded))
  }

  function usePrice() {
    const value = hasResult ? rounded : evaluate(expr)
    if (value === null) return
    onUsePrice(String(roundResult(Math.max(0, value), 2)))
    setExpr('')
  }

  // Format the expression for display with pretty operator glyphs.
  const prettyExpr = expr.replace(/[+\-*/]/g, (m) => ` ${DISPLAY_OP[m]} `).trim()

  return (
    <section className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto w-full max-w-md px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {/* Display / handle row — tap to collapse or expand */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 py-1 text-left"
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
          <>
            {/* Pipe-to-price action */}
            <button
              onClick={usePrice}
              disabled={!hasResult}
              className="mb-2 mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/30 transition active:scale-[0.98] active:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
            >
              <CornerDownLeft className="h-4 w-4" />
              Use {hasResult ? formatCurrency(roundResult(Math.max(0, rounded), 2)) : 'result'} as price
            </button>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2">
              <Key onClick={clearAll} variant="function" className="col-span-2">
                AC
              </Key>
              <Key onClick={backspace} variant="function" aria-label="Backspace">
                <Delete className="mx-auto h-5 w-5" />
              </Key>
              <Key onClick={() => append('/')} variant="operator">
                ÷
              </Key>

              <Key onClick={() => append('7')}>7</Key>
              <Key onClick={() => append('8')}>8</Key>
              <Key onClick={() => append('9')}>9</Key>
              <Key onClick={() => append('*')} variant="operator">
                ×
              </Key>

              <Key onClick={() => append('4')}>4</Key>
              <Key onClick={() => append('5')}>5</Key>
              <Key onClick={() => append('6')}>6</Key>
              <Key onClick={() => append('-')} variant="operator">
                −
              </Key>

              <Key onClick={() => append('1')}>1</Key>
              <Key onClick={() => append('2')}>2</Key>
              <Key onClick={() => append('3')}>3</Key>
              <Key onClick={() => append('+')} variant="operator">
                +
              </Key>

              <Key onClick={() => append('0')} className="col-span-2">
                0
              </Key>
              <Key onClick={() => append('.')}>.</Key>
              <Key onClick={equals} variant="equals">
                =
              </Key>
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
