import { prisma } from "@/lib/prisma"
import { analyzeStockLevels } from "@/lib/openai"
import Link from "next/link"
import {
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRightLeft,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  })

  const movements = await prisma.movement.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { product: true },
  })

  const analyzed = analyzeStockLevels(products)
  const criticalCount = analyzed.filter((p) => p.status === "critical").length
  const lowCount = analyzed.filter((p) => p.status === "low").length
  const okCount = analyzed.filter((p) => p.status === "ok").length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const todayMovements = movements.filter((m) => {
    const today = new Date()
    return m.createdAt.toDateString() === today.toDateString()
  })
  const entriesToday = todayMovements.filter((m) => m.type === "entrada").length
  const exitsToday = todayMovements.filter((m) => m.type === "salida").length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Resumen general del inventario</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Productos</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">{products.length}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Stock OK</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{okCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Stock Bajo</span>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{lowCount + criticalCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Valor Total</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">
            ${totalValue.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Productos con Alerta</h2>
          {criticalCount === 0 && lowCount === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400">¡Todo en orden! No hay productos con stock bajo.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyzed
                .filter((p) => p.status === "critical" || p.status === "low")
                .map((product) => (
                  <Link
                    key={product.name}
                    href="/products"
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          product.status === "critical"
                            ? "bg-red-50 dark:bg-red-900/30"
                            : "bg-amber-50 dark:bg-amber-900/30"
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            product.status === "critical"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">{product.name}</span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        product.status === "critical"
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {product.quantity} / {product.minStock} min
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Últimos Movimientos</h2>
            <Link
              href="/movements"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Ver todos
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {entriesToday} entradas hoy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {exitsToday} salidas hoy
              </span>
            </div>
          </div>

          {movements.length === 0 ? (
            <p className="text-center py-6 text-zinc-400 dark:text-zinc-500 text-sm">
              Sin movimientos registrados
            </p>
          ) : (
            <div className="space-y-3">
              {movements.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg ${
                      m.type === "entrada"
                        ? "bg-emerald-50 dark:bg-emerald-900/30"
                        : "bg-red-50 dark:bg-red-900/30"
                    }`}
                  >
                    <ArrowRightLeft
                      className={`w-4 h-4 ${
                        m.type === "entrada"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {m.product.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {m.type === "entrada" ? "+" : "-"}
                      {m.quantity} unidades
                    </p>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {m.createdAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
