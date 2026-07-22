import { useCallback, useEffect, useRef, useState } from 'react'
import { useGroceryStore } from './hooks/useGroceryStore'
import { useTheme } from './hooks/useTheme'
import { useBudgetColors } from './hooks/useBudgetColors'
import { toNumber } from './lib/format'
import AppShell from './components/AppShell'
import Header from './components/Header'
import BudgetSetup from './components/BudgetSetup'
import BudgetSummary from './components/BudgetSummary'
import GroceryList from './components/GroceryList'
import QuickAddPanel from './components/QuickAddPanel'
import PersistentNumberPad from './components/PersistentNumberPad'
import ClearListDialog from './components/ClearListDialog'
import ToastNotification from './components/ToastNotification'

export default function App() {
  const { budget, items, theme, sortMode, spent, ratio, actions } = useGroceryStore()
  const isDark = useTheme(theme)
  const { status } = useBudgetColors(ratio, isDark)

  const [menuOpen, setMenuOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [lastAddedId, setLastAddedId] = useState(null)
  const [summaryCompact, setSummaryCompact] = useState(false)
  const mainRef = useRef(null)

  // Quick-add fields — lives here so the persistent keypad can drive
  // whichever one (price or quantity) is currently active.
  const [itemName, setItemName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [activeInput, setActiveInput] = useState('price')
  const [editingId, setEditingId] = useState(null)

  const nameRef = useRef(null)
  const priceRef = useRef(null)
  const qtyRef = useRef(null)

  const resetQuickAdd = useCallback(() => {
    setItemName('')
    setPrice('')
    setQuantity('1')
    setActiveInput('price')
    setEditingId(null)
  }, [])

  const showToast = useCallback((message, extra) => {
    setToast({ message, ...extra })
  }, [])

  // -- Keypad routing ---------------------------------------------------------
  const appendDigit = useCallback(
    (d) => {
      if (activeInput === 'price') setPrice((v) => (v.length >= 10 ? v : v + d))
      else setQuantity((v) => (v.length >= 6 ? v : v + d))
    },
    [activeInput],
  )
  const appendDoubleZero = useCallback(() => {
    if (activeInput === 'price') setPrice((v) => (v ? v + '00' : v))
    else setQuantity((v) => (v ? v + '00' : v))
  }, [activeInput])
  const appendDecimal = useCallback(() => {
    if (activeInput === 'price') setPrice((v) => (v.includes('.') ? v : (v || '0') + '.'))
    else setQuantity((v) => (v.includes('.') ? v : (v || '0') + '.'))
  }, [activeInput])
  const backspace = useCallback(() => {
    if (activeInput === 'price') setPrice((v) => v.slice(0, -1))
    else setQuantity((v) => v.slice(0, -1))
  }, [activeInput])
  const clearActive = useCallback(() => {
    if (activeInput === 'price') setPrice('')
    else setQuantity('')
  }, [activeInput])

  const canAdd = toNumber(price) > 0

  const handleAdd = useCallback(() => {
    const priceNum = toNumber(price)
    const qtyNum = toNumber(quantity) > 0 ? toNumber(quantity) : 1
    if (priceNum <= 0) {
      showToast('Enter a price greater than zero')
      return
    }
    const name = itemName.trim() || `Item ${items.length + 1}`
    if (editingId) {
      actions.updateItem(editingId, { name, price: priceNum, quantity: qtyNum })
      showToast(`Updated "${name}"`)
    } else {
      const item = actions.addItem({ name, price: priceNum, quantity: qtyNum })
      setLastAddedId(item.id)
    }
    resetQuickAdd()
    priceRef.current?.focus()
  }, [itemName, price, quantity, items.length, editingId, actions, resetQuickAdd, showToast])

  // -- Physical-keyboard support while a numeric field is focused -------------
  useEffect(() => {
    function onKeyDown(e) {
      const focused = document.activeElement
      const onNumericField = focused === priceRef.current || focused === qtyRef.current
      if (!onNumericField) return
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        appendDigit(e.key)
      } else if (e.key === '.') {
        e.preventDefault()
        appendDecimal()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleAdd()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [appendDigit, appendDecimal, backspace, handleAdd])

  const handleEdit = useCallback((item) => {
    setEditingId(item.id)
    setItemName(item.name)
    setPrice(String(item.price))
    setQuantity(String(item.quantity))
    setActiveInput('price')
    nameRef.current?.focus()
  }, [])

  const handleDelete = useCallback(
    (item) => {
      const index = items.findIndex((it) => it.id === item.id)
      actions.deleteItem(item.id)
      showToast(`Deleted "${item.name}"`, {
        actionLabel: 'Undo',
        onAction: () => actions.restoreItem(item, index),
      })
    },
    [actions, items, showToast],
  )

  const handleUndoLast = useCallback(() => {
    actions.undoLastAdd()
    setLastAddedId(null)
    showToast('Last item removed')
  }, [actions, showToast])

  // Shrink the sticky summary once the list is scrolled, expand again near
  // the top. Wide hysteresis plus an rAF throttle keeps this from
  // oscillating: since the summary itself resizes while it's still in
  // normal flow, animating it near the toggle point can nudge scrollTop
  // (via the browser's scroll anchoring) right back across the threshold.
  const scrollRafRef = useRef(null)
  const handleMainScroll = useCallback(() => {
    if (scrollRafRef.current) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null
      const top = mainRef.current?.scrollTop ?? 0
      setSummaryCompact((prev) => (prev ? top > 24 : top > 96))
    })
  }, [])

  if (!budget) {
    return (
      <AppShell>
        <BudgetSetup onSubmit={actions.setBudget} />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Header
        theme={theme}
        onThemeChange={actions.setTheme}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        onResetBudget={actions.resetBudget}
        onNewListKeepBudget={() => {
          actions.newList(true)
          resetQuickAdd()
          showToast('Started a new list')
        }}
        onClearAll={() => setClearOpen(true)}
        onUndo={handleUndoLast}
        canUndo={items.length > 0}
        hasBudget={Boolean(budget)}
      />

      <main
        ref={mainRef}
        onScroll={handleMainScroll}
        className="flex-1 overflow-y-auto"
        style={{ overflowAnchor: 'none' }}
      >
        <div
          className="sticky top-0 z-10 backdrop-blur transition-colors duration-500"
          style={{
            backgroundColor: summaryCompact
              ? 'color-mix(in srgb, var(--surface-color) 92%, transparent)'
              : 'transparent',
            overflowAnchor: 'none',
          }}
        >
          <BudgetSummary
            budget={budget}
            spent={spent}
            ratio={ratio}
            status={status}
            onBudgetChange={actions.setBudget}
            compact={summaryCompact}
          />
        </div>

        <GroceryList
          items={items}
          sortMode={sortMode}
          onSortChange={actions.setSortMode}
          lastAddedId={lastAddedId}
          onToggle={actions.togglePurchased}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={actions.duplicateItem}
          onClearAll={() => setClearOpen(true)}
        />
      </main>

      {editingId && (
        <div
          className="flex items-center justify-between border-t px-4 py-1.5 text-xs transition-colors duration-500"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--glow-color)' }}
        >
          <span className="opacity-80">Editing item</span>
          <button type="button" className="font-semibold underline" onClick={resetQuickAdd}>
            Cancel
          </button>
        </div>
      )}

      <QuickAddPanel
        nameRef={nameRef}
        priceRef={priceRef}
        qtyRef={qtyRef}
        itemName={itemName}
        price={price}
        quantity={quantity}
        activeInput={activeInput}
        onNameChange={setItemName}
        onNameSubmit={() => {
          setActiveInput('price')
          priceRef.current?.focus()
        }}
        onFocusField={(field) => {
          setActiveInput(field)
          if (field === 'quantity' && quantity === '1') setQuantity('')
        }}
        onAdd={handleAdd}
        canAdd={canAdd}
        editing={Boolean(editingId)}
      />

      <PersistentNumberPad
        onDigit={appendDigit}
        onDoubleZero={appendDoubleZero}
        onDecimal={appendDecimal}
        onBackspace={backspace}
        onClear={clearActive}
        onConfirm={handleAdd}
        confirmLabel={editingId ? 'Save' : 'Add'}
        confirmDisabled={!canAdd}
      />

      <ClearListDialog
        open={clearOpen}
        onCancel={() => setClearOpen(false)}
        onConfirm={() => {
          actions.clearItems()
          setClearOpen(false)
          showToast('List cleared')
        }}
      />

      <ToastNotification
        toast={toast}
        onAction={() => {
          toast?.onAction?.()
          setToast(null)
        }}
        onDismiss={() => setToast(null)}
      />
    </AppShell>
  )
}
