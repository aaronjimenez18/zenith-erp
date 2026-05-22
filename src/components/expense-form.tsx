"use client";

import { useState } from "react";
import {
  createExpense,
  updateExpense,
} from "../app/dashboard/expenses/actions";
import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";

interface ExpenseFormProps {
  expense?: {
    id: string;
    description: string;
    amount: number;
    category: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ExpenseForm({
  expense,
  onClose,
  onSuccess,
}: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState(expense?.category || "");
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("description", description);
      formData.append("amount", amount);

      let result;
      if (expense) {
        result = await updateExpense(expense.id, formData);
      } else {
        result = await createExpense(formData);
      }

      if (result?.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-modal p-6 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          {expense ? "Editar Gasto" : "Registrar Gasto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-3 glass-input rounded-xl text-sm"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 glass-input rounded-xl text-sm"
              placeholder="Ej. Pago de renta marzo"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 glass-input rounded-xl text-sm"
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-white/30 disabled:opacity-50 rounded-xl font-medium text-sm"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 shadow-sm font-bold text-sm"
            >
              {isSubmitting
                ? "Guardando..."
                : expense
                  ? "Actualizar"
                  : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
