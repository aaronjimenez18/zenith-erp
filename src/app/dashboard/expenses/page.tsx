"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();

        if (data.length === 0 && !seedAttempted) {
          setSeedAttempted(true);
          const seedResult = await seedDefaultExpenses();
          if (seedResult?.success) {
            const updatedRes = await fetch("/api/expenses");
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
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Estas seguro de eliminar este gasto?")) {
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
      "Materiales de Oficina": "bg-gray-100 text-gray-700",
      "Transporte y Logistica": "bg-teal-100 text-teal-700",
      "Software y Suscripciones": "bg-indigo-100 text-indigo-700",
      Capacitacion: "bg-emerald-100 text-emerald-700",
      "Comisiones Bancarias": "bg-slate-100 text-slate-700",
      Otros: "bg-neutral-100 text-neutral-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando gastos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pt-20 md:pt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Gastos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registra y gestiona los gastos de tu negocio.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          + Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Gastos
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalGastos.toFixed(2)}
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Este Mes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Categorias</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(expenses.map((e) => e.category)).size}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Todos
        </button>
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left tracking-wider">
                Descripcion
              </th>
              <th className="px-6 py-3 text-right tracking-wider">Monto</th>
              <th className="px-6 py-3 text-center tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2"></span>
                    <p>No hay gastos registrados aun.</p>
                    <p className="text-sm">
                      Haz clic en "+ Nuevo Gasto" para comenzar.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(expense.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(expense.category)}`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white font-medium">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setEditingExpense(expense);
                        setIsFormOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-3 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
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
