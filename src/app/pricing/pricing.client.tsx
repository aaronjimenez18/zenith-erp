"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Básico",
    monthlyPrice: "300",
    annualPrice: "3,000",
    description: "Ideal para emprendedores que están empezando.",
    features: [
      "Productos ilimitados",
      "Inventario y ventas",
      "Gastos y dashboard",
      "Hasta 3 usuarios VENDEDOR",
      "14 días de prueba gratis",
    ],
    id: "BASIC",
    cta: "Empezar prueba gratis",
  },
  {
    name: "Premium",
    monthlyPrice: "800",
    annualPrice: "8,000",
    description: "Para negocios que necesitan potencia e inteligencia.",
    features: [
      "Todo lo del plan Básico",
      "Asistente con IA",
      "Hasta 3 usuarios ADMIN",
      "Gestión de gastos avanzada",
      "14 días de prueba gratis",
    ],
    id: "PREMIUM",
    cta: "Empezar prueba gratis",
  },
];

export default function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 py-12 sm:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-slate-200/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-slate-300/20 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center mb-10 relative z-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Planes Disponibles
        </h1>

        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !annual
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                annual
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Anual
            </button>
          </div>
          {annual && (
            <span className="ml-3 text-xs font-semibold text-emerald-700">
              Ahorra hasta 2 meses
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto relative z-10">
        {plans.map((plan, i) => (
          <div
            key={plan.id}
            className={`glass-card p-6 sm:p-8 rounded-[28px] hover:scale-[1.02] transition-transform ${
              i === 1 ? "ring-2 ring-slate-800/20" : ""
            }`}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
            <div className="mb-6">
              {annual ? (
                <>
                  <span className="text-4xl font-extrabold text-slate-800 tabular-nums">
                    ${plan.annualPrice}
                  </span>
                  <span className="text-slate-400 text-lg font-medium">/año</span>
                  <div className="text-xs text-emerald-700 font-medium mt-1">
                    ${plan.monthlyPrice}/mes al pagar anual
                  </div>
                </>
              ) : (
                <>
                  <span className="text-4xl font-extrabold text-slate-800 tabular-nums">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-slate-400 text-lg font-medium">/mes</span>
                </>
              )}
            </div>
            <p className="text-slate-500 mb-8 font-medium">{plan.description}</p>
            <ul className="space-y-4 mb-10 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-slate-500" /> {feature}
                </li>
              ))}
            </ul>
            <Link
              href={`/register?plan=${plan.id}&interval=${annual ? "annual" : "month"}`}
              className="block w-full py-4 rounded-xl font-bold text-white text-center transition-all bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            >
              {plan.cta || "Empezar prueba gratis"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
