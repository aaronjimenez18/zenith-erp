export function detectIntent(text: string): string {
  const lower = text.toLowerCase();

  const patterns: Record<string, RegExp[]> = {
    LOW_STOCK: [
      /stock.*baj|baj.*stock|poco stock|reponer|agotar|terminar.*stock/i,
    ],
    SALES_STATS: [/venta|ingreso|ganancia|beneficio|fatur|rendimient/i],
    INVENTORY: [/inventario|productos|stock|tengo|cuantos/i],
    EXPENSES: [/gasto|costo|perdid|compr/i],
    ANALYSIS: [/analiz|recomend|sugeren|insight|consejo/i],
    COMPARISON: [/compar|vs|versus|mejor.que|mayor.que/i],
  };

  for (const [intent, patternList] of Object.entries(patterns)) {
    if (patternList.some((p) => p.test(lower))) {
      return intent;
    }
  }

  return "GENERAL";
}
