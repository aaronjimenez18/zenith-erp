"use client";

import { useState, useEffect, useCallback } from "react";
import { Receipt } from "lucide-react";
import ExpenseForm from "../../../components/expense-form";
import { deleteExpense, seedDefaultExpenses } from "./actions";
import { EXPENSE_CATEGORIES } from "./constants";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [totalGastos, setTotalGastos] = useState(0);
  const [seedAttempted, setSeedAttempted] = useState(false);

  const fetchExpenses = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch("/api/expenses", { signal });
        if (res.ok) {
          const data = await res.json();

          if (data.length === 0 && !seedAttempted) {
            setSeedAttempted(true);
            const seedResult = await seedDefaultExpenses();
            if (seedResult?.success) {
              const updatedRes = await fetch("/api/expenses", { signal });
              if (updatedRes.ok) {
                const updatedData = await updatedRes.json();
                setExpenses(updatedData);
                const updatedTotal = updatedData.reduce(
                  (acc: number, exp: Expense) => acc + exp.amount,
                  0,
                );
                setTotalGastos(updatedTotal);
                return;
              }
            }
          }

          setExpenses(data);
          const total = data.reduce(
            (acc: number, exp: Expense) => acc + exp.amount,
            0,
          );
          setTotalGastos(total);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    },
    [seedAttempted],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchExpenses(controller.signal);
    return () => controller.abort();
  }, [fetchExpenses]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este gasto? No se puede deshacer.")) {
      await deleteExpense(id);
      fetchExpenses();
    }
  };

  const filteredExpenses =
    filter === "all"
      ? expenses
      : expenses.filter((exp) => exp.category === filter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Renta / Leasing": "bg-purple-100 text-purple-700",
      "Servicios (Luz, Agua, Internet)": "bg-blue-100 text-blue-700",
      "Sueldos y Nóminas": "bg-green-100 text-green-700",
      "Proveedores / Inventario": "bg-amber-100 text-amber-700",
      "Marketing y Publicidad": "bg-pink-100 text-pink-700",
      Seguros: "bg-cyan-100 text-cyan-700",
      Impuestos: "bg-red-100 text-red-700",
      Mantenimiento: "bg-orange-100 text-orange-700",
      "Materiales de Oficina": "bg-slate-100 text-slate-700",
      "Transporte y Logistica": "bg-teal-100 text-teal-700",
      "Software y Suscripciones": "bg-indigo-100 text-indigo-700",
      Capacitacion: "bg-emerald-100 text-emerald-700",
      "Comisiones Bancarias": "bg-slate-100 text-slate-700",
      Otros: "bg-slate-100 text-slate-700",
    };
    return colors[category] || "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Cargando gastos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Gastos
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Registra y gestiona los gastos de tu negocio.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-all font-bold shadow-sm"
        >
          + Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <p className="text-sm font-bold text-slate-500/80 uppercase tracking-wider">
            Total Gastos
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2 tabular-nums">
            ${totalGastos.toFixed(2)}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm font-bold text-slate-500/80 uppercase tracking-wider">
            Este Mes
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            $
            {expenses
              .filter((e) => {
                const expDate = new Date(e.createdAt);
                const now = new Date();
                return (
                  expDate.getMonth() === now.getMonth() &&
                  expDate.getFullYear() === now.getFullYear()
                );
              })
              .reduce((acc, e) => acc + e.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm font-bold text-slate-500/80 uppercase tracking-wider">
            Categorías
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            {new Set(expenses.map((e) => e.category)).size}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${
            filter === "all"
              ? "bg-slate-800 text-white shadow-sm"
              : "bg-white border border-[#e3e2df] text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          Todos
        </button>
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              filter === cat
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-white border border-[#e3e2df] text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="glass-card overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e3e2df]">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-extrabold">
            <tr>
              <th className="px-3 md:px-6 py-4 text-left tracking-wider">
                Fecha
              </th>
              <th className="px-3 md:px-6 py-4 text-left tracking-wider">
                Categoría
              </th>
              <th className="px-3 md:px-6 py-4 text-left tracking-wider">
                Descripción
              </th>
              <th className="px-3 md:px-6 py-4 text-right tracking-wider">
                Monto
              </th>
              <th className="px-3 md:px-6 py-4 text-center tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2df]">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-semibold">
                      No hay gastos registrados aún.
                    </p>
                    <p className="text-sm opacity-80">
                      Haz clic en &quot;+ Nuevo Gasto&quot; para comenzar.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                    {formatDate(expense.createdAt)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getCategoryColor(expense.category)}`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap font-bold text-slate-800 truncate max-w-[120px] sm:max-w-xs">
                    {expense.description}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-slate-800 font-extrabold tabular-nums">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setEditingExpense(expense);
                        setIsFormOpen(true);
                      }}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700 mr-3 text-sm font-bold transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="px-2 py-1 text-destructive/60 hover:text-destructive text-sm font-bold transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ExpenseForm
          expense={editingExpense || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(null);
          }}
          onSuccess={fetchExpenses}
        />
      )}
    </div>
  );
}
