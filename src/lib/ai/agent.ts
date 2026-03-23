import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface BusinessContext {
  products: { name: string; stock: number; price: number }[];
  todaySales: number;
  totalSales: number;
  expenses: number;
  topProducts: { name: string; quantity: number }[];
}

export async function askAI(
  userMessage: string,
  context: BusinessContext,
  chatHistory: { role: string; content: string }[] = [],
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });

  const prompt = buildPrompt(userMessage, context, chatHistory);

  const result = await model.generateContent(prompt);
  return result.response.text();
}

function buildPrompt(
  message: string,
  context: BusinessContext,
  history: { role: string; content: string }[],
): string {
  const productsList =
    context.products.length > 0
      ? context.products
          .map((p) => "- " + p.name + ": stock " + p.stock + ", $" + p.price)
          .join("\n")
      : "No hay productos";

  const topList =
    context.topProducts.length > 0
      ? context.topProducts
          .map((p) => "- " + p.name + ": " + p.quantity + " vendidos")
          .join("\n")
      : "Sin datos";

  const profit = context.totalSales - context.expenses;

  const historyText =
    history.length > 0
      ? history.map((h) => h.role + ": " + h.content).join("\n")
      : "Sin conversación previa";

  return `Eres Zenith AI, un asistente inteligente de negocios para un ERP.

INSTRUCCIONES:
1. Analiza la pregunta del usuario cuidadosamente
2. Usa los datos proporcionados para responder con precision
3. Si la pregunta es ambigua, pide clarificacion
4. Sugiere insights utiles cuando sea relevante

CONTEXTO DEL NEGOCIO:
Productos en inventario:
${productsList}

Ventas de hoy: $${context.todaySales}
Ventas totales: $${context.totalSales}
Gastos totales: $${context.expenses}
Ganancia neta: $${profit}

Top productos mas vendidos:
${topList}

CONVERSACION ANTERIOR:
${historyText}

PREGUNTA ACTUAL: ${message}

Responde de forma util, concisa y profesional. Si no tienes certeza, indicarlo.`;
}
