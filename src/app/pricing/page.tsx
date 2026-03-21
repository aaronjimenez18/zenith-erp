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
    color: "blue",
    id: "BASIC"
  },
  {
    name: "Premium",
    price: "1000",
    description: "Para negocios que necesitan potencia e inteligencia.",
    features: ["Todo lo del Básico", "Asistente con IA", "Múltiples Administradores", "Gestión de Gastos Pro"],
    buttonText: "10 días de prueba gratis",
    color: "purple",
    id: "PREMIUM"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Planes Disponibles</h1>
     
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:scale-105 transition-transform">
            <h3 className={`text-2xl font-bold text-${plan.color}-600 mb-2`}>{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
              <span className="text-slate-500 text-lg">/mes</span>
            </div>
            <p className="text-slate-600 mb-8">{plan.description}</p>
            <ul className="space-y-4 mb-10 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-700">
                  <Check className={`w-5 h-5 text-${plan.color}-500`} /> {feature}
                </li>
              ))}
            </ul>
            <Link 
              href={`/register?plan=${plan.id}`}
              className={`block w-full py-4 rounded-xl font-bold text-white text-center transition-colors bg-${plan.color === 'blue' ? 'blue-600 hover:bg-blue-700' : 'purple-600 hover:bg-purple-700'}`}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}