import { useCallback, useMemo, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'

const KEYS = {
  budget: 'underbudget:budget',
  items: 'underbudget:items',
  theme: 'underbudget:theme',
  sortMode: 'underbudget:sortMode',
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Central state for UnderBudget: budget, the grocery item list, theme, and
 * sort preference — all persisted to localStorage.
 */
export function useGroceryStore() {
  const [budget, setBudgetRaw] = useLocalStorage(KEYS.budget, null)
  const [items, setItems] = useLocalStorage(KEYS.items, [])
  const [theme, setTheme] = useLocalStorage(KEYS.theme, 'system')
  const [sortMode, setSortMode] = useLocalStorage(KEYS.sortMode, 'recent')

  const lastAddedRef = useRef(null)

  const spent = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )
  const ratio = budget ? spent / budget : 0

  const setBudget = useCallback(
    (amount) => setBudgetRaw(amount > 0 ? amount : null),
    [setBudgetRaw],
  )

  const resetBudget = useCallback(() => setBudgetRaw(null), [setBudgetRaw])

  const addItem = useCallback(
    ({ name, price, quantity }) => {
      const item = {
        id: makeId(),
        name: name.trim(),
        price,
        quantity,
        purchased: false,
        createdAt: Date.now(),
      }
      lastAddedRef.current = item.id
      setItems((prev) => [...prev, item])
      return item
    },
    [setItems],
  )

  const updateItem = useCallback(
    (id, patch) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
    },
    [setItems],
  )

  const deleteItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((it) => it.id !== id))
    },
    [setItems],
  )

  const restoreItem = useCallback(
    (item, index) => {
      setItems((prev) => {
        const next = [...prev]
        next.splice(Math.min(index, next.length), 0, item)
        return next
      })
    },
    [setItems],
  )

  const clearItems = useCallback(() => setItems([]), [setItems])

  const newList = useCallback(
    (preserveBudget) => {
      setItems([])
      if (!preserveBudget) setBudgetRaw(null)
    },
    [setItems, setBudgetRaw],
  )

  const togglePurchased = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, purchased: !it.purchased } : it)),
      )
    },
    [setItems],
  )

  const duplicateItem = useCallback(
    (id) => {
      setItems((prev) => {
        const item = prev.find((it) => it.id === id)
        if (!item) return prev
        const copy = { ...item, id: makeId(), createdAt: Date.now(), purchased: false }
        lastAddedRef.current = copy.id
        return [...prev, copy]
      })
    },
    [setItems],
  )

  const undoLastAdd = useCallback(() => {
    const id = lastAddedRef.current
    if (!id) return
    lastAddedRef.current = null
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [setItems])

  return {
    budget,
    items,
    theme,
    sortMode,
    spent,
    ratio,
    actions: {
      setBudget,
      resetBudget,
      addItem,
      updateItem,
      deleteItem,
      restoreItem,
      clearItems,
      newList,
      togglePurchased,
      duplicateItem,
      undoLastAdd,
      setTheme,
      setSortMode,
    },
  }
}
