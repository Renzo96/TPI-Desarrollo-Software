import { GoogleGenerativeAI } from "@google/generative-ai"

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

export async function getAIInsight(prompt: string): Promise<string> {
  const genAI = getGeminiClient()
  if (!genAI) {
    return "⚠️ GEMINI_API_KEY no configurada. Obtenela gratis en https://aistudio.google.com/apikey y agregala en .env para habilitar las funcionalidades de IA."
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const systemPrompt =
      "Sos un asistente experto en gestion de inventario. Respondé en español, de forma concisa y práctica. Máximo 3 párrafos."

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    })

    return result.response.text() || "Sin respuesta."
  } catch (error) {
    console.error("Gemini API error:", error)
    return "❌ Error al contactar la API de Gemini. Verificá tu clave y conexión."
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

export function generateAIPrompt(
  products: { name: string; quantity: number; minStock: number; category: string }[]
): string {
  const lowStock = products.filter((p) => p.quantity <= p.minStock)
  const outOfStock = products.filter((p) => p.quantity === 0)

  if (products.length === 0) {
    return "No hay productos en el inventario. ¿Qué recomendaciones darías para empezar a gestionar un inventario desde cero?"
  }

  let prompt = `Analizá este inventario y dame recomendaciones prácticas:\n\n`

  if (outOfStock.length > 0) {
    prompt += `PRODUCTOS SIN STOCK:\n${outOfStock.map((p) => `- ${p.name} (${p.category})`).join("\n")}\n\n`
  }

  if (lowStock.length > 0) {
    prompt += `PRODUCTOS CON STOCK BAJO:\n${lowStock.map((p) => `- ${p.name}: ${p.quantity} unidades (mínimo: ${p.minStock})`).join("\n")}\n\n`
  }

  const categories = [...new Set(products.map((p) => p.category))]
  prompt += `Categorías: ${categories.join(", ")}.\n`
  prompt += `Total de productos: ${products.length}.\n\n`
  prompt += `¿Qué acciones recomendarías para optimizar este inventario? Sé específico.`

  return prompt
}
