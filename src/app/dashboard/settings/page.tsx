"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Building2, Percent, Save, RotateCcw, CreditCard, User, Users, Trash2, AlertTriangle, LogOut } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

  // Profile
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [originalUserName, setOriginalUserName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Business
  const [businessName, setBusinessName] = useState("");
  const [originalBusinessName, setOriginalBusinessName] = useState("");
  const [businessPlan, setBusinessPlan] = useState("BASIC");
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [businessSaved, setBusinessSaved] = useState(false);

  // Margins
  const [profitMargin, setProfitMargin] = useState(30);
  const [wholesaleMargin, setWholesaleMargin] = useState(15);
  const [savingMargins, setSavingMargins] = useState(false);
  const [marginsSaved, setMarginsSaved] = useState(false);

  // Team
  const [teamCount, setTeamCount] = useState(0);
  const [userRole, setUserRole] = useState("");

  // Danger zone
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async (signal?: AbortSignal) => {
    try {
      const [meRes, businessRes] = await Promise.all([
        fetch("/api/auth/me", { signal }),
        fetch("/api/business", { signal }),
      ]);

      if (meRes.ok) {
        const me = await meRes.json();
        setUserName(me.name || "");
        setOriginalUserName(me.name || "");
        setUserEmail(me.email || "");
        setUserRole(me.role || "");
      }

      if (businessRes.ok) {
        const biz = await businessRes.json();
        setBusinessName(biz.name || "");
        setOriginalBusinessName(biz.name || "");
        setBusinessPlan(biz.plan || "BASIC");
        setProfitMargin(biz.profitMargin ?? 30);
        setWholesaleMargin(biz.wholesaleMargin ?? 15);
      }

      // Try to get team count from users API
      try {
        const usersRes = await fetch("/api/users", { signal });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setTeamCount(Array.isArray(usersData) ? usersData.length : 0);
        }
      } catch {
        // non-admin users might not have access
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSettings(controller.signal);
    return () => controller.abort();
  }, [fetchSettings]);

  const saveProfile = async () => {
    if (!userName.trim()) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName.trim() }),
      });
      if (res.ok) {
        setOriginalUserName(userName.trim());
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSavingProfile(false);
    }
  };

  const saveBusinessName = async () => {
    if (!businessName.trim()) return;
    setSavingBusiness(true);
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: businessName.trim() }),
      });
      if (res.ok) {
        setOriginalBusinessName(businessName.trim());
        setBusinessSaved(true);
        setTimeout(() => setBusinessSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSavingBusiness(false);
    }
  };

  const saveMargins = async () => {
    setSavingMargins(true);
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profitMargin, wholesaleMargin }),
      });
      if (res.ok) {
        setMarginsSaved(true);
        setTimeout(() => setMarginsSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSavingMargins(false);
    }
  };

  const resetMargins = () => {
    setProfitMargin(30);
    setWholesaleMargin(15);
  };

  const handleDeleteBusiness = async () => {
    if (confirmDelete !== "ELIMINAR") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/business", { method: "DELETE" });
      if (res.ok) {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
      } else {
        const err = await res.json();
        alert(err.error || "Error al eliminar negocio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de servidor");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200/50 rounded-xl w-48" />
        <div className="h-28 bg-slate-200/50 rounded-3xl" />
        <div className="h-28 bg-slate-200/50 rounded-3xl" />
        <div className="h-40 bg-slate-200/50 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10 space-y-6 md:space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Configuración
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Administra tu perfil y los datos de tu negocio.
        </p>
      </header>

      {/* Profile */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Perfil</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Tu nombre"
                className="flex-1 p-3 glass-input rounded-xl text-sm font-medium"
              />
              <button
                onClick={saveProfile}
                disabled={savingProfile || !userName.trim() || userName.trim() === originalUserName}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm shrink-0"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? "Guardando..." : profileSaved ? "¡Guardado!" : "Guardar"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full p-3 glass-input rounded-xl text-sm font-medium opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1 font-medium">El email no se puede cambiar.</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-bold bg-white/60 text-slate-500 px-2.5 py-0.5 rounded-full border border-white/50 uppercase tracking-wider">
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Business Name */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Nombre del Negocio</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nombre de tu empresa"
            className="flex-1 p-3 glass-input rounded-xl text-sm font-medium"
          />
          <button
            onClick={saveBusinessName}
            disabled={savingBusiness || !businessName.trim() || businessName.trim() === originalBusinessName}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm shrink-0"
          >
            <Save className="w-4 h-4" />
            {savingBusiness ? "Guardando..." : businessSaved ? "¡Guardado!" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Margins */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Percent className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Márgenes de Ganancia</h2>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Se aplicarán automáticamente al registrar nuevos productos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              % Ganancia (Venta)
            </label>
            <div className="relative">
              <input
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                min="0"
                max="500"
                step="0.5"
                className="w-full p-3 glass-input rounded-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              % Ganancia (Mayoreo)
            </label>
            <div className="relative">
              <input
                type="number"
                value={wholesaleMargin}
                onChange={(e) => setWholesaleMargin(parseFloat(e.target.value) || 0)}
                min="0"
                max="500"
                step="0.5"
                className="w-full p-3 glass-input rounded-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={saveMargins}
            disabled={savingMargins}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            {savingMargins ? "Guardando..." : marginsSaved ? "¡Guardado!" : "Guardar"}
          </button>
          <button
            onClick={resetMargins}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/40 text-slate-700 rounded-xl font-bold hover:bg-white/60 transition-all border border-white/50"
          >
            <RotateCcw className="w-4 h-4" />
            Resetear
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <CreditCard className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Plan</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Plan actual</p>
            <p className="text-xl font-extrabold text-slate-800 mt-1 capitalize">
              {businessPlan === "PREMIUM" ? "Premium" : "Básico"}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm ${
              businessPlan === "PREMIUM"
                ? "bg-slate-800/10 text-slate-700 border-slate-300"
                : "bg-white/40 text-slate-500 border-white/50"
            }`}>
              {businessPlan}
            </span>
            {businessPlan === "BASIC" && (
              <Link
                href="/dashboard/suscripcion"
                className="block mt-2 text-xs font-bold text-primary hover:underline"
              >
                Ver planes disponibles →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Equipo</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Miembros</p>
            <p className="text-xl font-extrabold text-slate-800 mt-1 tabular-nums">{teamCount}</p>
          </div>
          <Link
            href="/dashboard/users"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
          >
            Gestionar
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      {userRole === "SUPER_ADMIN" && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-destructive/20 bg-destructive/[0.02]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-destructive/10 rounded-xl text-destructive">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Zona de Peligro</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Eliminar el negocio borrará todos los productos, ventas, gastos y usuarios. Esta acción no se puede deshacer.
          </p>
          {deleting ? (
            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Eliminando...
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Escribe <span className="font-extrabold text-destructive">ELIMINAR</span> para confirmar
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                    placeholder="ELIMINAR"
                    className="flex-1 p-3 glass-input rounded-xl text-sm font-bold uppercase tracking-widest"
                  />
                  <button
                    onClick={handleDeleteBusiness}
                    disabled={confirmDelete !== "ELIMINAR"}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-destructive text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Negocio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
