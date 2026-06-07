import { createProduct } from "@/app/actions"

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Nuevo Producto</h1>

      <form action={createProduct} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Ej: Resma de papel A4"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Descripción opcional del producto"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              SKU / Código *
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ej: PAPEL-A4-001"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Categoría *
            </label>
            <input
              type="text"
              name="category"
              id="category"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ej: Librería"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Precio Unitario *
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Stock Inicial *
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              required
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Unidad
            </label>
            <input
              type="text"
              name="unit"
              id="unit"
              defaultValue="unidad"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="minStock" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Stock Mínimo *
          </label>
          <input
            type="number"
            name="minStock"
            id="minStock"
            required
            min="0"
            defaultValue={5}
            className="w-full sm:w-48 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Se alertará cuando el stock esté en este nivel o por debajo.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Crear Producto
          </button>
          <a
            href="/products"
            className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
