# UnderBudget

A mobile-first, list-based budget calculator. Set a budget, add items to a
list, and use the always-on calculator to crunch numbers (price-per-ounce,
splitting a cost) before piping the result straight into a new item. Built for
groceries but generic enough for travel or project budgets.

## Features

- **Sticky budget header** — total budget, spent, and remaining balance with a
  progress bar that turns **orange at 80%** and **red past 100%**.
- **Item list** — add, edit, and delete items with a name, price, and quantity.
- **Persistent calculator** — a docked keypad (`+ − × ÷`) that stays accessible
  and can pipe its live result directly into a new item's price field.
- **Local persistence** — budget and items are saved to `localStorage`, so your
  list survives refreshes (and syncs across tabs).
- **Mobile-first** — designed for one-handed use, responsive up to larger
  screens, with light/dark support.

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

State lives in `src/App.jsx` and is persisted through the `useLocalStorage`
hook (`src/hooks/useLocalStorage.js`). Totals are derived from the items list.

```
src/
  App.jsx                 # state management + overall layout
  hooks/useLocalStorage.js
  lib/
    format.js             # currency / number helpers
    calculator.js         # safe arithmetic evaluator (no eval)
  components/
    BudgetHeader.jsx      # sticky top: budget, spent, remaining, progress bar
    ItemList.jsx          # scrollable middle: list + empty state
    ItemRow.jsx           # a single item row (edit / delete)
    ItemFormSheet.jsx     # bottom-sheet form for adding / editing
    Calculator.jsx        # sticky bottom keypad + pipe-to-price
```
