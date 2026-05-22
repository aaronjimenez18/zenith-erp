"use client";

import { useState, useEffect, useCallback } from "react";
import { Percent, Save, RotateCcw } from "lucide-react";

interface Margins {
  profitMargin: number;
  wholesaleMargin: number;
}

export function MarginSettings() {
  const [margins, setMargins] = useState<Margins>({ profitMargin: 30, wholesaleMargin: 15 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchMargins = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/business", { signal });
      const data = await res.json();
      if (data.profitMargin !== undefined) {
        setMargins({ profitMargin: data.profitMargin, wholesaleMargin: data.wholesaleMargin });
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
    fetchMargins(controller.signal);
    return () => controller.abort();
  }, [fetchMargins]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(margins),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setMargins({ profitMargin: 30, wholesaleMargin: 15 });
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-3xl animate-pulse">
        <div className="h-6 bg-slate-200/50 rounded-xl w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-200/50 rounded-xl" />
          <div className="h-10 bg-slate-200/50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-slate-400/40 rounded-full" />
          <h2 className="text-xl font-bold text-slate-800">Márgenes de Ganancia</h2>
        </div>
        <button
          onClick={() => setShow(!show)}
          className="md:hidden p-2 hover:bg-slate-50 rounded-lg transition"
          aria-label="Abrir márgenes"
        >
          <Percent className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className={`${show ? "block" : "hidden"} md:block space-y-4`}>
        <p className="text-sm text-slate-500">
          Estos porcentajes se aplicarán automáticamente al registrar nuevos productos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              % Ganancia (Venta)
            </label>
            <div className="relative">
              <input
                type="number"
                value={margins.profitMargin}
                onChange={(e) => setMargins({ ...margins, profitMargin: parseFloat(e.target.value) || 0 })}
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
                value={margins.wholesaleMargin}
                onChange={(e) => setMargins({ ...margins, wholesaleMargin: parseFloat(e.target.value) || 0 })}
                min="0"
                max="500"
                step="0.5"
                className="w-full p-3 glass-input rounded-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/40 text-slate-700 rounded-xl font-bold hover:bg-white/60 transition-all border border-white/50"
          >
            <RotateCcw className="w-4 h-4" />
            Resetear
          </button>
        </div>
      </div>
    </div>
  );
}
