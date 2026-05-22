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
    plan: "BASIC"
  });

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl === "PREMIUM" || planFromUrl === "BASIC") {
      setFormData(prev => ({ ...prev, plan: planFromUrl }));
    }
  }, [searchParams]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      router.push("/login");
    } else {
      alert(data.error || "No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.");
    }
    setSubmitting(false);
  };

  return (
    <div className="glass-card p-8 rounded-[28px] w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-[14px] bg-primary shadow-sm flex items-center justify-center text-white text-lg font-bold mb-3">
          Z
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Zenith ERP</h2>
      </div>
      <div className={`text-center mb-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${formData.plan === 'PREMIUM' ? 'bg-white/50 text-slate-600' : 'bg-white/50 text-slate-600'}`}>
        Registro Plan {formData.plan}
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
        <button disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-sm">
          {submitting ? "Registrando..." : "Registrar Empresa"}
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
