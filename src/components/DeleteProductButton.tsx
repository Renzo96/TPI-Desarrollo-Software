"use client"

import { deleteProduct } from "@/app/actions"
import { Trash2 } from "lucide-react"

export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <form action={deleteProduct.bind(null, id)}>
      <button
        type="submit"
        className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        onClick={(e) => {
          if (!confirm("¿Eliminar este producto?")) e.preventDefault()
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  )
}
