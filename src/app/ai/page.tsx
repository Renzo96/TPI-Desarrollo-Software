import { prisma } from "@/lib/prisma"
import { getAIInsight, analyzeStockLevels, generateAIPrompt } from "@/lib/openai"
import { Brain, Sparkles, AlertTriangle, TrendingUp, Package } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AIPage() {
  const products = await prisma.product.findMany({
    orderBy: { quantity: "asc" },
  })

  const analyzed = analyzeStockLevels(products)
  const criticalCount = analyzed.filter((p) => p.status === "critical").length
  const lowCount = analyzed.filter((p) => p.status === "low").length

  const prompt = generateAIPrompt(products)
  const insight = await getAIInsight(prompt)

  const categories = [...new Set(products.map((p) => p.category))]
  const categoryStats = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat)
    return {
      category: cat,
      count: catProducts.length,
      totalQuantity: catProducts.reduce((s, p) => s + p.quantity, 0),
      totalValue: catProducts.reduce((s, p) => s + p.price * p.quantity, 0),
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-xl">
          <Brain className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">IA Insights</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Análisis inteligente de tu inventario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Productos</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Alertas</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {criticalCount + lowCount}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Categorías</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{categories.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recomendación IA</h2>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {insight.split("\n").map((paragraph, i) => (
                <p key={i} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Por Categoría</h2>
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">{stat.category}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{stat.count}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Productos</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{stat.totalQuantity}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Unidades</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ${stat.totalValue.toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Valor</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Productos Críticos</h2>
            {analyzed.filter((p) => p.status === "critical").length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay productos sin stock</p>
            ) : (
              <div className="space-y-2">
                {analyzed
                  .filter((p) => p.status === "critical")
                  .map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-red-600 dark:text-red-400 font-medium">{p.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
