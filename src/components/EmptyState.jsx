import { ShoppingBasket } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <ShoppingBasket className="h-8 w-8 opacity-30" aria-hidden="true" />
      <p className="text-sm font-medium opacity-70">Your list is empty</p>
      <p className="max-w-[26ch] text-xs opacity-50">
        Add your first grocery item and UnderBudget will track your spending as you shop.
      </p>
    </div>
  )
}
