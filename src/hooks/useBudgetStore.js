import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORE_KEY = 'underbudget:v2'

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function makeList(name = 'My List', budget = 0) {
  return { id: createId(), name, budget, items: [], createdAt: Date.now() }
}

function defaultState() {
  const first = makeList()
  return {
    version: 2,
    activeListId: first.id,
    lists: [first],
    settings: { currency: 'USD', theme: 'system' },
    history: [],
  }
}

/**
 * One-time migration from the v1 flat keys (single budget + items) into the v2
 * multi-list shape. Returns a state object if v1 data existed, else null.
 */
function migrateV1() {
  try {
    const rawBudget = window.localStorage.getItem('underbudget:budget')
    const rawItems = window.localStorage.getItem('underbudget:items')
    if (rawBudget === null && rawItems === null) return null

    const budget = rawBudget ? JSON.parse(rawBudget) : 0
    const items = rawItems ? JSON.parse(rawItems) : []
    const list = { ...makeList('My List', budget), items }

    window.localStorage.removeItem('underbudget:budget')
    window.localStorage.removeItem('underbudget:items')

    return {
      version: 2,
      activeListId: list.id,
      lists: [list],
      settings: { currency: 'USD', theme: 'system' },
      history: [],
    }
  } catch {
    return null
  }
}

/**
 * Central store for UnderBudget: multiple lists, per-list budget + items,
 * app settings, and calculator history — all persisted to localStorage.
 */
export function useBudgetStore() {
  const [state, setState] = useLocalStorage(STORE_KEY, () => migrateV1() ?? defaultState())

  // Guard against malformed persisted data.
  const safe = useMemo(() => {
    if (!state || !Array.isArray(state.lists) || state.lists.length === 0) {
      return defaultState()
    }
    return state
  }, [state])

  const activeList = useMemo(
    () => safe.lists.find((l) => l.id === safe.activeListId) ?? safe.lists[0],
    [safe],
  )

  // -- Helpers ---------------------------------------------------------------
  const patchActiveList = useCallback(
    (updater) => {
      setState((prev) => ({
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === (prev.activeListId ?? prev.lists[0]?.id)
            ? { ...l, ...updater(l) }
            : l,
        ),
      }))
    },
    [setState],
  )

  // -- Budget ----------------------------------------------------------------
  const setBudget = useCallback(
    (budget) => patchActiveList(() => ({ budget })),
    [patchActiveList],
  )

  // -- Items -----------------------------------------------------------------
  const addItem = useCallback(
    (data) =>
      patchActiveList((l) => ({
        items: [
          ...l.items,
          {
            id: createId(),
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            note: data.note ?? '',
            purchased: false,
            createdAt: Date.now(),
          },
        ],
      })),
    [patchActiveList],
  )

  const updateItem = useCallback(
    (id, data) =>
      patchActiveList((l) => ({
        items: l.items.map((it) => (it.id === id ? { ...it, ...data } : it)),
      })),
    [patchActiveList],
  )

  const deleteItem = useCallback(
    (id) =>
      patchActiveList((l) => ({ items: l.items.filter((it) => it.id !== id) })),
    [patchActiveList],
  )

  // Re-insert a previously deleted item at its original index (for undo).
  const restoreItem = useCallback(
    (item, index) =>
      patchActiveList((l) => {
        const next = l.items.slice()
        next.splice(Math.min(index, next.length), 0, item)
        return { items: next }
      }),
    [patchActiveList],
  )

  const duplicateItem = useCallback(
    (id) =>
      patchActiveList((l) => {
        const idx = l.items.findIndex((it) => it.id === id)
        if (idx === -1) return {}
        const copy = { ...l.items[idx], id: createId(), purchased: false, createdAt: Date.now() }
        const next = l.items.slice()
        next.splice(idx + 1, 0, copy)
        return { items: next }
      }),
    [patchActiveList],
  )

  const togglePurchased = useCallback(
    (id) =>
      patchActiveList((l) => ({
        items: l.items.map((it) =>
          it.id === id ? { ...it, purchased: !it.purchased } : it,
        ),
      })),
    [patchActiveList],
  )

  const setItemQuantity = useCallback(
    (id, quantity) =>
      patchActiveList((l) => ({
        items: l.items.map((it) =>
          it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it,
        ),
      })),
    [patchActiveList],
  )

  const moveItem = useCallback(
    (id, dir) =>
      patchActiveList((l) => {
        const idx = l.items.findIndex((it) => it.id === id)
        const swap = idx + dir
        if (idx === -1 || swap < 0 || swap >= l.items.length) return {}
        const next = l.items.slice()
        ;[next[idx], next[swap]] = [next[swap], next[idx]]
        return { items: next }
      }),
    [patchActiveList],
  )

  const sortItems = useCallback(
    (mode) =>
      patchActiveList((l) => {
        const items = l.items.slice()
        const cmp = {
          nameAsc: (a, b) => a.name.localeCompare(b.name),
          priceDesc: (a, b) => b.price * b.quantity - a.price * a.quantity,
          priceAsc: (a, b) => a.price * a.quantity - b.price * b.quantity,
          unpurchased: (a, b) => Number(a.purchased) - Number(b.purchased),
        }[mode]
        if (cmp) items.sort(cmp)
        return { items }
      }),
    [patchActiveList],
  )

  const clearItems = useCallback(
    () => patchActiveList(() => ({ items: [] })),
    [patchActiveList],
  )

  // -- Lists -----------------------------------------------------------------
  const addList = useCallback(
    (name) => {
      const list = makeList(name?.trim() || 'New List')
      setState((prev) => ({
        ...prev,
        lists: [...prev.lists, list],
        activeListId: list.id,
      }))
      return list.id
    },
    [setState],
  )

  const renameList = useCallback(
    (id, name) =>
      setState((prev) => ({
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === id ? { ...l, name: name.trim() || l.name } : l,
        ),
      })),
    [setState],
  )

  const deleteList = useCallback(
    (id) =>
      setState((prev) => {
        if (prev.lists.length <= 1) return prev // always keep one
        const lists = prev.lists.filter((l) => l.id !== id)
        const activeListId =
          prev.activeListId === id ? lists[0].id : prev.activeListId
        return { ...prev, lists, activeListId }
      }),
    [setState],
  )

  const setActiveList = useCallback(
    (id) => setState((prev) => ({ ...prev, activeListId: id })),
    [setState],
  )

  // -- Settings --------------------------------------------------------------
  const setCurrency = useCallback(
    (currency) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, currency } })),
    [setState],
  )

  const setTheme = useCallback(
    (theme) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, theme } })),
    [setState],
  )

  // -- Calculator history ----------------------------------------------------
  const pushHistory = useCallback(
    (entry) =>
      setState((prev) => ({
        ...prev,
        history: [entry, ...(prev.history ?? [])].slice(0, 20),
      })),
    [setState],
  )

  const clearHistory = useCallback(
    () => setState((prev) => ({ ...prev, history: [] })),
    [setState],
  )

  // -- Import / export -------------------------------------------------------
  const replaceState = useCallback(
    (next) => {
      if (!next || !Array.isArray(next.lists) || next.lists.length === 0) {
        throw new Error('Invalid data')
      }
      setState({
        version: 2,
        activeListId: next.activeListId ?? next.lists[0].id,
        lists: next.lists,
        settings: { currency: 'USD', theme: 'system', ...next.settings },
        history: Array.isArray(next.history) ? next.history : [],
      })
    },
    [setState],
  )

  const resetAll = useCallback(() => setState(defaultState()), [setState])

  return {
    state: safe,
    activeList,
    settings: safe.settings,
    history: safe.history ?? [],
    actions: {
      setBudget,
      addItem,
      updateItem,
      deleteItem,
      restoreItem,
      duplicateItem,
      togglePurchased,
      setItemQuantity,
      moveItem,
      sortItems,
      clearItems,
      addList,
      renameList,
      deleteList,
      setActiveList,
      setCurrency,
      setTheme,
      pushHistory,
      clearHistory,
      replaceState,
      resetAll,
    },
  }
}
