import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import BudgetHeader from './components/BudgetHeader'
import ItemList from './components/ItemList'
import ItemFormSheet from './components/ItemFormSheet'
import Calculator from './components/Calculator'

const BUDGET_KEY = 'underbudget:budget'
const ITEMS_KEY = 'underbudget:items'

function createId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

export default function App() {
  // --- Persistent state -----------------------------------------------------
  const [budget, setBudget] = useLocalStorage(BUDGET_KEY, 0)
  const [items, setItems] = useLocalStorage(ITEMS_KEY, [])

  // --- Ephemeral UI state ---------------------------------------------------
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [prefillPrice, setPrefillPrice] = useState('')
  const [calcCollapsed, setCalcCollapsed] = useState(false)

  // --- Derived totals -------------------------------------------------------
  const spent = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  // --- Item actions ---------------------------------------------------------
  const openAdd = useCallback(() => {
    setEditingItem(null)
    setPrefillPrice('')
    setSheetOpen(true)
  }, [])

  const openEdit = useCallback((item) => {
    setEditingItem(item)
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    setEditingItem(null)
    setPrefillPrice('')
  }, [])

  const submitItem = useCallback((data) => {
    setItems((prev) => {
      if (data.id) {
        return prev.map((it) => (it.id === data.id ? { ...it, ...data } : it))
      }
      return [...prev, { ...data, id: createId() }]
    })
    setSheetOpen(false)
    setEditingItem(null)
    setPrefillPrice('')
  }, [setItems])

  const deleteItem = useCallback(
    (id) => setItems((prev) => prev.filter((it) => it.id !== id)),
    [setItems],
  )

  const clearAll = useCallback(() => {
    if (window.confirm('Remove all items from the list?')) setItems([])
  }, [setItems])

  // Pipe a calculator result into a brand-new item's price field.
  const useCalcResult = useCallback((value) => {
    setEditingItem(null)
    setPrefillPrice(value)
    setSheetOpen(true)
  }, [])

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <BudgetHeader budget={budget} spent={spent} onBudgetChange={setBudget} />

      <main className="relative flex-1 overflow-y-auto">
        <ItemList
          items={items}
          onEdit={openEdit}
          onDelete={deleteItem}
          onAdd={openAdd}
          onClearAll={clearAll}
        />

        {/* Bottom padding so the last row clears the floating add button. */}
        <div className="h-24" />

        {/* Floating add button — sticks above the calculator. */}
        {items.length > 0 && (
          <div className="pointer-events-none sticky bottom-4 z-10 mx-auto flex w-full max-w-md justify-end px-4">
            <button
              onClick={openAdd}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/25 active:scale-95 dark:bg-white dark:text-slate-900"
              aria-label="Add item"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        )}
      </main>

      <Calculator
        collapsed={calcCollapsed}
        onToggle={() => setCalcCollapsed((c) => !c)}
        onUsePrice={useCalcResult}
      />

      <ItemFormSheet
        open={sheetOpen}
        editingItem={editingItem}
        prefillPrice={prefillPrice}
        onClose={closeSheet}
        onSubmit={submitItem}
      />
    </div>
  )
}
