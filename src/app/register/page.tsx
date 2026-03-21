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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) router.push("/login");
    else alert("Error al registrar");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Zenith ERP</h2>
      <div className={`text-center mb-6 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${formData.plan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
        Registro Plan {formData.plan}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Nombre de la Empresa" required
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
        />
        <input
          type="text" placeholder="Tu Nombre" required
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email" placeholder="Correo Administrativo" required
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="password" placeholder="Contraseña" required
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
          Registrar Empresa
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-500">Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
