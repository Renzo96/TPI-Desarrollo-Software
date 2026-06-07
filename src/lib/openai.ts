import OpenAI from "openai"

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function getAIInsight(prompt: string): Promise<string> {
  const openai = getOpenAIClient()
  if (!openai) {
    return "⚠️ OPENAI_API_KEY no configurada. Agregala en .env para habilitar las funcionalidades de IA."
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Sos un asistente experto en gestión de inventario. Respondé en español, de forma concisa y práctica. Máximo 3 párrafos.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content ?? "Sin respuesta."
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "❌ Error al contactar la API de OpenAI. Verificá tu clave y conexión."
  }
}

export function analyzeStockLevels(
  products: { name: string; quantity: number; minStock: number }[]
): { name: string; quantity: number; minStock: number; status: "critical" | "low" | "ok" }[] {
  return products.map((p) => ({
    ...p,
    status: p.quantity === 0 ? "critical" : p.quantity <= p.minStock ? "low" : "ok",
  }))
}

export function generateAIPrompt(products: { name: string; quantity: number; minStock: number; category: string }[]): string {
  const lowStock = products.filter((p) => p.quantity <= p.minStock)
  const outOfStock = products.filter((p) => p.quantity === 0)

  if (products.length === 0) {
    return "No hay productos en el inventario. ¿Qué recomendaciones darías para empezar a gestionar un inventario desde cero?"
  }

  let prompt = `Analizá este inventario y dame recomendaciones prácticas:\n\n`

  if (outOfStock.length > 0) {
    prompt += `🚨 PRODUCTOS SIN STOCK:\n${outOfStock.map((p) => `- ${p.name} (${p.category})`).join("\n")}\n\n`
  }

  if (lowStock.length > 0) {
    prompt += `⚠️ PRODUCTOS CON STOCK BAJO:\n${lowStock.map((p) => `- ${p.name}: ${p.quantity} unidades (mínimo: ${p.minStock})`).join("\n")}\n\n`
  }

  const categories = [...new Set(products.map((p) => p.category))]
  prompt += `Categorías: ${categories.join(", ")}.\n`
  prompt += `Total de productos: ${products.length}.\n\n`
  prompt += `¿Qué acciones recomendarías para optimizar este inventario? Sé específico.`

  return prompt
}
