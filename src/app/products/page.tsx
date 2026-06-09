import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Package, Search, Plus, Pencil } from "lucide-react"
import DeleteProductButton from "@/components/DeleteProductButton"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Productos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{products.length} productos registrados</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Sin productos</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Agregá tu primer producto para empezar</p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Producto
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Producto</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Categoría</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Precio</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stock</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.map((product) => {
                  const stockStatus =
                    product.quantity === 0
                      ? "critical"
                      : product.quantity <= product.minStock
                        ? "low"
                        : "ok"

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
                          {product.sku}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          ${product.price.toLocaleString("es-AR")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-semibold ${
                            stockStatus === "critical"
                              ? "text-red-600 dark:text-red-400"
                              : stockStatus === "low"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              stockStatus === "critical"
                                ? "bg-red-500"
                                : stockStatus === "low"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                          {product.quantity} {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
