"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Básico",
    price: "500",
    description: "Ideal para emprendedores que están empezando.",
    features: ["1 Super Admin", "Gestión de Inventario", "Ventas y Reportes básicos", "Soporte por email"],
    buttonText: "10 días de prueba gratis",
    id: "BASIC"
  },
  {
    name: "Premium",
    price: "1000",
    description: "Para negocios que necesitan potencia e inteligencia.",
    features: ["Todo lo del Básico", "Asistente con IA", "Múltiples Administradores", "Gestión de Gastos Pro"],
    buttonText: "10 días de prueba gratis",
    id: "PREMIUM"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 sm:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-slate-200/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-slate-300/20 blur-[150px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-16 relative z-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">Planes Disponibles</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto relative z-10">
        {plans.map((plan, i) => (
          <div key={plan.id} className={`glass-card p-6 sm:p-8 rounded-[28px] hover:scale-[1.02] transition-transform ${i === 1 ? 'ring-2 ring-slate-800/20' : ''}`}>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-800 tabular-nums">${plan.price}</span>
              <span className="text-slate-400 text-lg font-medium">/mes</span>
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
              href={`/register?plan=${plan.id}`}
              className="block w-full py-4 rounded-xl font-bold text-white text-center transition-all bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}