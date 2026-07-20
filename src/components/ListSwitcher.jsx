import { Plus, Settings2 } from 'lucide-react'
import { tapHaptic } from '../lib/haptics'

/** Horizontal, scrollable list tabs plus add + settings affordances. */
export default function ListSwitcher({
  lists,
  activeListId,
  onSelect,
  onManage,
  onAdd,
  onOpenSettings,
}) {
  return (
    <div className="flex items-center gap-2 px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {lists.map((list) => {
          const active = list.id === activeListId
          return (
            <button
              key={list.id}
              onClick={() => {
                if (active) {
                  onManage()
                } else {
                  tapHaptic()
                  onSelect(list.id)
                }
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-500 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {list.name}
            </button>
          )
        })}
        <button
          onClick={onAdd}
          className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 active:scale-95 dark:bg-slate-800 dark:text-slate-400"
          aria-label="Add list"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={onOpenSettings}
        className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 active:scale-95 dark:bg-slate-800 dark:text-slate-400"
        aria-label="Settings"
      >
        <Settings2 className="h-5 w-5" />
      </button>
    </div>
  )
}
