import { stripe } from "./stripe";

const TRIAL_DAYS = 14;

export const PLANS = [
  {
    id: "BASIC",
    name: "Básico",
    description: "Ideal para emprendedores que están empezando.",
    monthlyPrice: 30000, // $300.00 MXN in cents
    annualPrice: 300000, // $3,000.00 MXN in cents
    features: [
      "Productos ilimitados",
      "Inventario y ventas",
      "Gastos y dashboard",
      "Hasta 3 usuarios VENDEDOR",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Para negocios que necesitan potencia e inteligencia.",
    monthlyPrice: 80000, // $800.00 MXN in cents
    annualPrice: 800000, // $8,000.00 MXN in cents
    features: [
      "Todo lo del plan Básico",
      "Asistente con IA",
      "Hasta 3 usuarios ADMIN",
      "Gestión de gastos avanzada",
    ],
  },
] as const;

let priceCache: Record<string, { monthly: string; annual: string }> | null = null;

async function createProductAndPrices(plan: typeof PLANS[number]) {
  const product = await stripe.products.create({
    name: `Zenith ERP - ${plan.name}`,
    description: plan.description,
    metadata: { app_id: "zenith-erp", plan: plan.id },
  });

  const monthly = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.monthlyPrice,
    currency: "mxn",
    recurring: { interval: "month", trial_period_days: TRIAL_DAYS },
    metadata: { app_id: "zenith-erp", plan: plan.id, interval: "month" },
  });

  const annual = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.annualPrice,
    currency: "mxn",
    recurring: { interval: "year", trial_period_days: TRIAL_DAYS },
    metadata: { app_id: "zenith-erp", plan: plan.id, interval: "year" },
  });

  return { monthly: monthly.id, annual: annual.id };
}

export async function getOrCreatePriceIds(): Promise<
  Record<string, { monthly: string; annual: string }>
> {
  if (priceCache) return priceCache;

  const existing = await stripe.products.search({
    query: "metadata['app_id']:'zenith-erp'",
    limit: 10,
  });

  if (existing.data.length > 0) {
    const result: Record<string, { monthly: string; annual: string }> = {};
    for (const product of existing.data) {
      const planId = product.metadata.plan;
      if (!planId) continue;
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 10,
      });
      const monthly = prices.data.find(
        (p) => p.metadata.interval === "month",
      );
      const annual = prices.data.find(
        (p) => p.metadata.interval === "year",
      );
      if (monthly && annual) {
        result[planId] = { monthly: monthly.id, annual: annual.id };
      }
    }
    if (Object.keys(result).length === PLANS.length) {
      priceCache = result;
      return result;
    }
  }

  const result: Record<string, { monthly: string; annual: string }> = {};
  for (const plan of PLANS) {
    result[plan.id] = await createProductAndPrices(plan);
  }
  priceCache = result;
  return result;
}
