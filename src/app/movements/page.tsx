import { prisma } from "@/lib/prisma"
import { registerMovement } from "@/app/actions"
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MovementsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  })

  const movements = await prisma.movement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Movimientos</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">Registro de entradas y salidas de stock</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Registrar Movimiento</h2>
            <form action={registerMovement} className="space-y-4">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Producto *
                </label>
                <select
                  name="productId"
                  id="productId"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Tipo *
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="entrada">Entrada (+)</option>
                  <option value="salida">Salida (-)</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Cantidad *
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Cantidad"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Motivo
                </label>
                <input
                  type="text"
                  name="reason"
                  id="reason"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ej: Compra a proveedor"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Registrar Movimiento
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {movements.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <ArrowRightLeft className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">Sin movimientos registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-4"
                >
                  <div
                    className={`p-2.5 rounded-xl ${
                      m.type === "entrada"
                        ? "bg-emerald-50 dark:bg-emerald-900/30"
                        : "bg-red-50 dark:bg-red-900/30"
                    }`}
                  >
                    {m.type === "entrada" ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {m.product.name}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {m.type === "entrada" ? "Entrada" : "Salida"} de {m.quantity} {m.product.unit}
                      {m.reason && <span> — {m.reason}</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        m.type === "entrada"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {m.type === "entrada" ? "+" : "-"}
                      {m.quantity}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {m.createdAt.toLocaleDateString("es-AR")}{" "}
                      {m.createdAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
