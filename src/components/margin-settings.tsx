"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch("/api/business")
      .then((res) => res.json())
      .then((data) => {
        if (data.profitMargin !== undefined) {
          setMargins({ profitMargin: data.profitMargin, wholesaleMargin: data.wholesaleMargin });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-bold text-slate-900">Márgenes de Ganancia</h2>
        </div>
        <button
          onClick={() => setShow(!show)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Resetear
          </button>
        </div>
      </div>
    </div>
  );
}
