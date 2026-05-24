"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    email: "",
    password: "",
    plan: "BASIC",
    interval: "month",
  });

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    const intervalFromUrl = searchParams.get("interval");
    if (planFromUrl === "PREMIUM" || planFromUrl === "BASIC") {
      setFormData(prev => ({ ...prev, plan: planFromUrl }));
    }
    if (intervalFromUrl === "annual" || intervalFromUrl === "month") {
      setFormData(prev => ({ ...prev, interval: intervalFromUrl }));
    }
  }, [searchParams]);

  const [submitting, setSubmitting] = useState(false);
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setShowVerifyMessage(true);
      }
    } else {
      alert(data.error || "No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.");
      setSubmitting(false);
    }
  };

  const plans = [
    { id: "BASIC", label: "Básico", monthly: "$300/mes", annual: "$3,000/año" },
    { id: "PREMIUM", label: "Premium", monthly: "$800/mes", annual: "$8,000/año" },
  ];

  if (showVerifyMessage) {
    return (
      <div className="glass-card p-8 rounded-[28px] w-full max-w-md text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Revisa tu correo</h2>
        <p className="text-sm text-slate-500">
          Te enviamos un enlace de verificación. Confírmalo para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-[28px] w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-[14px] bg-primary shadow-sm flex items-center justify-center text-white text-lg font-bold mb-3">
          Z
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Zenith ERP</h2>
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
          Plan
        </label>
        <div className="grid grid-cols-2 gap-2">
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setFormData({ ...formData, plan: p.id })}
              className={`p-3 rounded-xl border text-center transition-all ${
                formData.plan === p.id
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-slate-200 bg-white/50 text-slate-600"
              }`}
            >
              <span className="text-sm font-bold">{p.label}</span>
              <span className="block text-[10px] mt-0.5 opacity-70">{p.monthly}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, interval: "month" })}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              formData.plan && formData.interval === "month"
                ? "bg-slate-800 text-white"
                : "bg-white/50 text-slate-500"
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, interval: "annual" })}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              formData.plan && formData.interval === "annual"
                ? "bg-slate-800 text-white"
                : "bg-white/50 text-slate-500"
            }`}
          >
            Anual (ahorra 2 meses)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Nombre de la Empresa" required
          className="w-full p-3 glass-input rounded-xl text-sm"
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
        />
        <input
          type="text" placeholder="Tu Nombre" required
          className="w-full p-3 glass-input rounded-xl text-sm"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email" placeholder="Correo Administrativo" required
          className="w-full p-3 glass-input rounded-xl text-sm"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="password" placeholder="Contraseña" required
          className="w-full p-3 glass-input rounded-xl text-sm"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <p className="text-[10px] text-slate-400 text-center">
          Prueba gratis de 14 días. Sin cargo hasta que termine el periodo.
        </p>
        <button disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-sm">
          {submitting ? "Creando cuenta..." : "Empieza tu prueba gratis"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-200/40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-300/30 blur-[150px] pointer-events-none" />
      <Suspense fallback={<div className="text-slate-500">Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
