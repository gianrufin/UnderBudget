import { useCallback, useMemo, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'

const KEYS = {
  budget: 'underbudget:budget',
  items: 'underbudget:items',
  theme: 'underbudget:theme',
  sortMode: 'underbudget:sortMode',
  currency: 'underbudget:currency',
  hideCompleted: 'underbudget:hideCompleted',
  hapticsEnabled: 'underbudget:hapticsEnabled',
  plannedItems: 'underbudget:plannedItems',
  priceMemory: 'underbudget:priceMemory',
  lastList: 'underbudget:lastList',
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Central state for UnderBudget: budget, the grocery item list, a separate
 * "planning" list, theme/currency/sort preferences — all persisted to
 * localStorage.
 */
export function useGroceryStore() {
  const [budget, setBudgetRaw] = useLocalStorage(KEYS.budget, null)
  const [items, setItems] = useLocalStorage(KEYS.items, [])
  const [theme, setTheme] = useLocalStorage(KEYS.theme, 'system')
  const [sortMode, setSortMode] = useLocalStorage(KEYS.sortMode, 'recent')
  const [currency, setCurrency] = useLocalStorage(KEYS.currency, 'PHP')
  const [hideCompleted, setHideCompleted] = useLocalStorage(KEYS.hideCompleted, false)
  const [hapticsEnabled, setHapticsEnabled] = useLocalStorage(KEYS.hapticsEnabled, true)
  const [plannedItems, setPlannedItems] = useLocalStorage(KEYS.plannedItems, [])
  const [priceMemory, setPriceMemory] = useLocalStorage(KEYS.priceMemory, {})
  const [lastList, setLastList] = useLocalStorage(KEYS.lastList, [])

  const lastAddedRef = useRef(null)

  const spent = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )
  const ratio = budget ? spent / budget : 0

  // Most recently used unique prices, newest first — powers the recent-price
  // shortcuts so re-buying the same item is a single tap.
  const recentPrices = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const item of [...items].sort((a, b) => b.createdAt - a.createdAt)) {
      if (seen.has(item.price)) continue
      seen.add(item.price)
      out.push(item.price)
      if (out.length >= 4) break
    }
    return out
  }, [items])

  // Rough forecast for the planning list, using whatever price we last saw
  // for each planned item's name (0 if we've never bought it before).
  const plannedEstimate = useMemo(
    () => plannedItems.reduce((sum, p) => sum + (priceMemory[p.name.toLowerCase()] ?? 0), 0),
    [plannedItems, priceMemory],
  )

  const setBudget = useCallback(
    (amount) => setBudgetRaw(amount > 0 ? amount : null),
    [setBudgetRaw],
  )

  const resetBudget = useCallback(() => setBudgetRaw(null), [setBudgetRaw])

  const rememberPrice = useCallback(
    (name, price) => {
      const key = name.trim().toLowerCase()
      if (!key) return
      setPriceMemory((prev) => ({ ...prev, [key]: price }))
    },
    [setPriceMemory],
  )

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
      rememberPrice(item.name, price)
      return item
    },
    [setItems, rememberPrice],
  )

  const updateItem = useCallback(
    (id, patch) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
      if (patch.name && patch.price != null) rememberPrice(patch.name, patch.price)
    },
    [setItems, rememberPrice],
  )

  const adjustQuantity = useCallback(
    (id, delta) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it,
        ),
      )
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

  // Snapshot the current cart (name/price/quantity only) so it can be
  // restocked later, whenever the list is about to be cleared.
  const stashLastList = useCallback(
    (list) => {
      if (list.length === 0) return
      setLastList(list.map(({ name, price, quantity }) => ({ name, price, quantity })))
    },
    [setLastList],
  )

  const clearItems = useCallback(() => {
    stashLastList(items)
    setItems([])
  }, [items, setItems, stashLastList])

  const newList = useCallback(
    (preserveBudget) => {
      stashLastList(items)
      setItems([])
      if (!preserveBudget) setBudgetRaw(null)
    },
    [items, setItems, setBudgetRaw, stashLastList],
  )

  const restockLastList = useCallback(() => {
    if (lastList.length === 0) return
    const fresh = lastList.map((it) => ({
      id: makeId(),
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      purchased: false,
      createdAt: Date.now(),
    }))
    setItems((prev) => [...prev, ...fresh])
  }, [lastList, setItems])

  const togglePurchased = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, purchased: !it.purchased } : it)),
      )
    },
    [setItems],
  )

  const undoLastAdd = useCallback(() => {
    const id = lastAddedRef.current
    if (!id) return
    lastAddedRef.current = null
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [setItems])

  // -- Planning list ----------------------------------------------------------
  const addPlannedItems = useCallback(
    (names) => {
      setPlannedItems((prev) => {
        const existing = new Set(prev.map((p) => p.name.toLowerCase()))
        const fresh = []
        for (const raw of names) {
          const name = raw.trim()
          if (!name) continue
          const key = name.toLowerCase()
          if (existing.has(key)) continue
          existing.add(key)
          fresh.push({ id: makeId(), name, createdAt: Date.now() })
        }
        return fresh.length ? [...prev, ...fresh] : prev
      })
    },
    [setPlannedItems],
  )

  const removePlannedItem = useCallback(
    (id) => {
      setPlannedItems((prev) => prev.filter((p) => p.id !== id))
    },
    [setPlannedItems],
  )

  const clearPlannedItems = useCallback(() => setPlannedItems([]), [setPlannedItems])

  return {
    budget,
    items,
    theme,
    sortMode,
    currency,
    hideCompleted,
    hapticsEnabled,
    recentPrices,
    plannedItems,
    priceMemory,
    plannedEstimate,
    lastList,
    spent,
    ratio,
    actions: {
      setBudget,
      resetBudget,
      addItem,
      updateItem,
      adjustQuantity,
      deleteItem,
      restoreItem,
      clearItems,
      newList,
      restockLastList,
      togglePurchased,
      undoLastAdd,
      setTheme,
      setSortMode,
      setCurrency,
      setHideCompleted,
      setHapticsEnabled,
      addPlannedItems,
      removePlannedItem,
      clearPlannedItems,
    },
  }
}
