# UnderBudget

A mobile-first grocery budget calculator for fast, one-handed use while
shopping. Set a budget, punch in items on the always-visible number pad, and
watch the entire screen shift color as you get closer to your limit.

_Stay aware. Spend within your limit._

## Features

- **Persistent number pad** — a docked, calculator-style keypad that never
  hides behind a modal. It drives whichever field is active (price or
  quantity), so the native mobile keyboard never pops up.
- **One-handed flow** — type an item name, tap the price field, punch in the
  price, tap **Add**. The name field clears and refocuses so you can go
  straight into the next product without lifting your thumb.
- **Full-canvas budget color** — the background gradient, cards, borders,
  progress bar, glow, and buttons all interpolate smoothly from cool green
  (comfortable) through yellow, orange, and red (over budget) based on
  `spent / budget`. Status is always paired with a text label
  ("Be mindful", "Over budget", …), never color alone.
- **Item management** — mark items purchased, duplicate, edit inline (reuses
  the same quick-add row), delete with an **undo** toast, and sort by recency,
  price, or name.
- **Budget controls** — edit the budget inline, reset it, or start a new list
  while keeping the current budget, all from a compact overflow menu.
- **Local persistence** — budget, items, theme, and sort preference are saved
  to `localStorage` and restored on refresh. No account or backend required.
- **Light / dark, AMOLED-friendly** — true near-black surfaces in dark mode,
  with the same budget-driven gradients layered on top.
- **Accessible** — labeled inputs, visible focus states, live-region status
  announcements, large tap targets, and `prefers-reduced-motion` support.
- **Installable PWA** — manifest + service worker (via `vite-plugin-pwa`)
  precache the app shell, so it installs to the home screen and keeps working
  fully offline after the first load. Updates apply automatically in the
  background.

## Tech stack

React (Vite) · Tailwind CSS v4 · Lucide React icons · vite-plugin-pwa

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Architecture

State lives in `useGroceryStore` (budget, items, theme, sort — persisted via
`useLocalStorage`). `useBudgetColors` turns the spend ratio into a set of CSS
custom properties (`--canvas-start`, `--accent-color`, `--progress-color`,
etc.) that every surface reads from, so the color transition is driven from
one place. `App.jsx` owns the ephemeral quick-add state (`itemName`, `price`,
`quantity`, `activeInput`) and wires the persistent number pad to whichever
field is active.

```
src/
  App.jsx                     # composition, quick-add state, keypad routing
  hooks/
    useGroceryStore.js        # budget, items, theme, sort + persistence
    useLocalStorage.js        # persistence primitive (+ cross-tab sync)
    useTheme.js                # light / dark / system, returns isDark
    useBudgetColors.js         # ratio -> CSS custom properties
  lib/
    color.js                  # budget color stops + interpolation
    format.js                 # currency (en-PH / PHP) + number helpers
    haptics.js                # vibration tap
  components/
    Header.jsx / UnderBudgetLogo.jsx / ThemeToggle.jsx / OverflowMenu.jsx
    BudgetSetup.jsx            # first-run budget entry
    BudgetSummary.jsx / BudgetProgress.jsx / BudgetStatus.jsx / BudgetEditor.jsx
    GroceryList.jsx / GroceryItemRow.jsx / EmptyState.jsx
    QuickAddPanel.jsx / ItemNameInput.jsx / PriceDisplay.jsx / QuantityInput.jsx
    PersistentNumberPad.jsx    # the always-visible keypad
    ClearListDialog.jsx / ToastNotification.jsx / AppShell.jsx
```

## Currency

Defaults to Philippine peso via `Intl.NumberFormat('en-PH', { currency: 'PHP' })`
in `lib/format.js`. The locale/currency are parameters, so more currencies can
be added later without touching call sites.

## PWA

`vite-plugin-pwa` is configured in `vite.config.js` with `registerType:
'autoUpdate'` — it generates the manifest, a service worker (Workbox
`generateSW` strategy), and injects the registration script into
`index.html` at build time. Icons live in `public/` (`icon.svg`,
`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`,
`apple-touch-icon.png`). The service worker only runs in production builds
(`npm run build && npm run preview`) — it's disabled in `npm run dev`.
