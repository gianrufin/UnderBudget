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
        />
      </div>
    </header>
  )
}
