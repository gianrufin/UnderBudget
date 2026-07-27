import { ClipboardList } from 'lucide-react'
import UnderBudgetLogo from './UnderBudgetLogo'
import ThemeToggle from './ThemeToggle'
import OverflowMenu from './OverflowMenu'

export default function Header({
  theme,
  onThemeChange,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onResetBudget,
  onNewListKeepBudget,
  onClearAll,
  onUndo,
  canUndo,
  hasBudget,
  onOpenCurrency,
  onOpenSupport,
  onShareList,
  canShare,
  onRestockLastList,
  canRestock,
  hapticsEnabled,
  onToggleHaptics,
  onOpenPlanning,
  plannedCount,
}) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur transition-colors duration-500"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'color-mix(in srgb, var(--surface-color) 85%, transparent)',
      }}
    >
      <UnderBudgetLogo />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPlanning}
          aria-label={plannedCount > 0 ? `Plan your next shop, ${plannedCount} planned` : 'Plan your next shop'}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors active:scale-95"
          style={{ borderColor: 'var(--border-color)', color: 'var(--accent-color)' }}
        >
          <ClipboardList className="h-4 w-4" />
          {plannedCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
              style={{ backgroundColor: 'var(--primary-button-color)' }}
            >
              {plannedCount}
            </span>
          )}
        </button>
        <ThemeToggle theme={theme} onChange={onThemeChange} />
        <OverflowMenu
          open={menuOpen}
          onOpen={onMenuOpen}
          onClose={onMenuClose}
          onResetBudget={onResetBudget}
          onNewListKeepBudget={onNewListKeepBudget}
          onClearAll={onClearAll}
          onUndo={onUndo}
          canUndo={canUndo}
          hasBudget={hasBudget}
          onOpenCurrency={onOpenCurrency}
          onOpenSupport={onOpenSupport}
          onShareList={onShareList}
          canShare={canShare}
          onRestockLastList={onRestockLastList}
          canRestock={canRestock}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={onToggleHaptics}
        />
      </div>
    </header>
  )
}
