import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useBudgetStore } from './hooks/useBudgetStore'
import { useTheme } from './hooks/useTheme'
import { CurrencyProvider } from './context/CurrencyContext'
import ListSwitcher from './components/ListSwitcher'
import BudgetHeader from './components/BudgetHeader'
import ItemList from './components/ItemList'
import ItemFormSheet from './components/ItemFormSheet'
import Calculator from './components/Calculator'
import SettingsSheet from './components/SettingsSheet'
import ListManagerSheet from './components/ListManagerSheet'
import Toast from './components/Toast'

export default function App() {
  const { state, activeList, settings, history, actions } = useBudgetStore()
  useTheme(settings.theme)

  // -- Ephemeral UI state ----------------------------------------------------
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [prefillPrice, setPrefillPrice] = useState('')
  const [calcCollapsed, setCalcCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [listsOpen, setListsOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const items = activeList.items
  const spent = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )
  const purchasedCount = useMemo(
    () => items.filter((i) => i.purchased).length,
    [items],
  )

  // -- Item actions ----------------------------------------------------------
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

  const submitItem = useCallback(
    (data) => {
      if (data.id) actions.updateItem(data.id, data)
      else actions.addItem(data)
      closeSheet()
    },
    [actions, closeSheet],
  )

  // Delete with an undo toast.
  const handleDelete = useCallback(
    (item) => {
      const index = items.findIndex((it) => it.id === item.id)
      actions.deleteItem(item.id)
      setToast({
        message: `Deleted "${item.name}"`,
        actionLabel: 'Undo',
        onAction: () => actions.restoreItem(item, index),
      })
    },
    [actions, items],
  )

  const clearAll = useCallback(() => {
    if (items.length && window.confirm('Remove all items from the list?')) {
      actions.clearItems()
    }
  }, [actions, items.length])

  // Pipe a calculator result into a brand-new item's price field.
  const useCalcResult = useCallback((value) => {
    setEditingItem(null)
    setPrefillPrice(value)
    setSheetOpen(true)
  }, [])

  // -- Export / import -------------------------------------------------------
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `underbudget-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state])

  const importData = useCallback(
    (parsed) => {
      try {
        actions.replaceState(parsed)
        setSettingsOpen(false)
        setToast({ message: 'Data imported' })
      } catch {
        window.alert('That file is not a valid UnderBudget export.')
      }
    },
    [actions],
  )

  return (
    <CurrencyProvider currency={settings.currency}>
      <div className="flex h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        {/* Sticky top: list tabs + budget summary */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
          <ListSwitcher
            lists={state.lists}
            activeListId={activeList.id}
            onSelect={actions.setActiveList}
            onManage={() => setListsOpen(true)}
            onAdd={() => setListsOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <BudgetHeader
            budget={activeList.budget}
            spent={spent}
            itemCount={items.length}
            purchasedCount={purchasedCount}
            onBudgetChange={actions.setBudget}
          />
        </header>

        <main className="relative flex-1 overflow-y-auto">
          <ItemList
            items={items}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={actions.togglePurchased}
            onDuplicate={actions.duplicateItem}
            onMove={actions.moveItem}
            onSort={actions.sortItems}
            onAdd={openAdd}
            onClearAll={clearAll}
          />

          <div className="h-24" />

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
          history={history}
          onPushHistory={actions.pushHistory}
          onClearHistory={actions.clearHistory}
        />

        <ItemFormSheet
          open={sheetOpen}
          editingItem={editingItem}
          prefillPrice={prefillPrice}
          onClose={closeSheet}
          onSubmit={submitItem}
        />

        <ListManagerSheet
          open={listsOpen}
          lists={state.lists}
          activeListId={activeList.id}
          onClose={() => setListsOpen(false)}
          onSelect={actions.setActiveList}
          onAdd={actions.addList}
          onRename={actions.renameList}
          onDelete={actions.deleteList}
        />

        <SettingsSheet
          open={settingsOpen}
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onCurrencyChange={actions.setCurrency}
          onThemeChange={actions.setTheme}
          onExport={exportData}
          onImport={importData}
          onReset={() => {
            actions.resetAll()
            setSettingsOpen(false)
          }}
        />

        <Toast
          toast={toast}
          onAction={() => {
            toast?.onAction?.()
            setToast(null)
          }}
          onDismiss={() => setToast(null)}
        />
      </div>
    </CurrencyProvider>
  )
}
