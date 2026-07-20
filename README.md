# UnderBudget

A mobile-first, list-based budget calculator. Set a budget, add items to a
list, and use the always-on calculator to crunch numbers (price-per-ounce,
splitting a cost) before piping the result straight into a new item. Built for
groceries but generic enough for travel or project budgets.

## Features

- **Sticky budget header** — total budget, spent, remaining balance, and
  in-cart count, with a progress bar that turns **orange at 80%** and **red
  past 100%**.
- **Multiple lists** — keep separate budgets for groceries, a trip, a project,
  etc. Create, rename, delete, and switch between them from the top tabs.
- **Rich items** — name, price, quantity, and an optional note. Check items off
  (in-cart), edit, duplicate, reorder (up/down), and delete — with an **undo**
  toast on delete. Sort by name, price, or “to buy first”.
- **Persistent calculator** — a docked keypad (`+ − × ÷`, `%`, `±`) with a live
  result, **calculation history**, physical-keyboard support, and a button to
  pipe the result straight into a new item's price.
- **Settings** — currency picker (15 currencies), light / dark / system theme,
  and JSON **export / import** plus a full reset.
- **Local persistence** — everything is saved to `localStorage` (with a v1→v2
  migration) and syncs across tabs.
- **Mobile-first & installable** — one-handed layout, haptic taps, safe-area
  padding, a PWA manifest, and light/dark support.

## Tech stack

React (Vite) · Tailwind CSS v4 · Lucide React icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Architecture

State is centralized in the `useBudgetStore` hook and persisted through
`useLocalStorage`. `App.jsx` wires the store to the UI; totals are derived from
the active list's items. Currency formatting flows through a small context.

```
src/
  App.jsx                    # composition, UI state, export/import, undo
  context/CurrencyContext.jsx
  hooks/
    useBudgetStore.js        # lists, items, settings, history + persistence
    useLocalStorage.js       # persistence primitive (+ cross-tab sync)
    useTheme.js              # light / dark / system
  lib/
    format.js                # currency / number helpers
    calculator.js            # safe arithmetic evaluator (no eval)
    currencies.js            # supported currencies
    haptics.js               # vibration tap
  components/
    ListSwitcher.jsx         # top list tabs + settings
    BudgetHeader.jsx         # budget, spent, remaining, progress bar
    ItemList.jsx / ItemRow.jsx   # list, sort, per-row actions
    ItemFormSheet.jsx        # add / edit item (name, price, qty, note)
    Calculator.jsx           # keypad, history, keyboard, pipe-to-price
    ListManagerSheet.jsx     # create / rename / delete lists
    SettingsSheet.jsx        # currency, theme, export / import, reset
    Sheet.jsx / Toast.jsx    # reusable bottom sheet + undo toast
```
