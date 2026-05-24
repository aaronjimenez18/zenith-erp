"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert(data.error || "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-200/40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-300/30 blur-[150px] pointer-events-none" />

      <div className="glass-card p-10 rounded-[28px] w-full max-w-sm relative z-10">
        {verified && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-green-800">¡Cuenta lista!</p>
            <p className="text-xs text-green-600 mt-0.5">Tu suscripción está activa. Inicia sesión para comenzar.</p>
          </div>
        )}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-primary shadow-sm flex items-center justify-center text-white text-lg font-bold mb-4">
            Z
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Zenith ERP</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Correo</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 glass-input rounded-xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 glass-input rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-sm"
          >
            {loading ? "Validando..." : "Entrar a mi cuenta"}
          </button>

          <p className="text-center text-sm text-slate-500 font-medium">
            ¿Eres nuevo?{" "}
            <a href="/register" className="text-slate-800 font-bold hover:underline">
              Registra tu negocio
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-slate-500">Cargando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}