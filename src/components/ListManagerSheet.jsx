import { useState } from 'react'
import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import Sheet from './Sheet'
import { useCurrency } from '../context/CurrencyContext'

/** Manage lists: create, rename, delete, and switch. */
export default function ListManagerSheet({
  open,
  lists,
  activeListId,
  onClose,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}) {
  const { fmt } = useCurrency()
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')

  function startRename(list) {
    setEditingId(list.id)
    setDraft(list.name)
  }

  function commitRename(id) {
    onRename(id, draft)
    setEditingId(null)
  }

  return (
    <Sheet open={open} title="Your lists" onClose={onClose}>
      <ul className="flex flex-col gap-2">
        {lists.map((list) => {
          const spent = list.items.reduce((s, i) => s + i.price * i.quantity, 0)
          const active = list.id === activeListId
          const isEditing = editingId === list.id
          return (
            <li
              key={list.id}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
                active
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {isEditing ? (
                <form
                  className="flex flex-1 items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    commitRename(list.id)
                  }}
                >
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commitRename(list.id)}
                    className="w-full rounded-lg bg-slate-100 px-2 py-1 text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-500 p-1.5 text-white"
                    aria-label="Save name"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onSelect(list.id)
                      onClose()
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate font-medium text-slate-900 dark:text-white">
                      {list.name}
                    </div>
                    <div className="text-xs text-slate-400 tabular-nums">
                      {list.items.length} {list.items.length === 1 ? 'item' : 'items'} ·{' '}
                      {fmt(spent)}
                    </div>
                  </button>
                  <button
                    onClick={() => startRename(list)}
                    className="rounded-full p-2 text-slate-400 active:bg-slate-100 dark:active:bg-slate-800"
                    aria-label={`Rename ${list.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        lists.length > 1 &&
                        window.confirm(`Delete "${list.name}" and its items?`)
                      ) {
                        onDelete(list.id)
                      }
                    }}
                    disabled={lists.length <= 1}
                    className="rounded-full p-2 text-slate-400 active:bg-red-50 active:text-red-500 disabled:opacity-30 dark:active:bg-red-950"
                    aria-label={`Delete ${list.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </li>
          )
        })}
      </ul>

      <button
        onClick={() => {
          const id = onAdd() // creates a list named "New List" and returns its id
          setDraft('New List')
          setEditingId(id) // drop straight into rename for the fresh list
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 active:bg-slate-50 dark:border-slate-700 dark:active:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        New list
      </button>
    </Sheet>
  )
}
