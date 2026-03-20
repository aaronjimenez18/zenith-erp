export function detectIntent(message: string) {
  const text = message.toLowerCase();

  if (text.includes("stock bajo")) {
    return "LOW_STOCK";
  }

  if (text.includes("ventas")) {
    return "SALES_STATS";
  }

  if (text.includes("buscar")) {
    return "SEARCH_PRODUCT";
  }

  return "GENERAL";
}
