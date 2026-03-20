"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const EXPENSE_CATEGORIES = [
  "Renta / Leasing",
  "Servicios (Luz, Agua, Internet)",
  "Sueldos y Nóminas",
  "Proveedores / Inventario",
  "Marketing y Publicidad",
  "Seguros",
  "Impuestos",
  "Mantenimiento",
  "Materiales de Oficina",
  "Transporte y Logística",
  "Software y Suscripciones",
  "Capacitación",
  "Comisiones Bancarias",
  "Otros",
];

async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return {
    businessId: payload.businessId as string,
    userId: payload.userId as string,
  };
}

export async function createExpense(formData: FormData) {
  try {
    const { businessId } = await getAuthData();

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;

    await db.expense.create({
      data: { description, amount, category, businessId },
    });

    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error al crear gasto:", error);
    return { error: "No se pudo registrar el gasto" };
  }
}

export async function updateExpense(id: string, formData: FormData) {
  try {
    await getAuthData();

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;

    await db.expense.update({
      where: { id },
      data: { description, amount, category },
    });

    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    return { error: "No se pudo actualizar el gasto" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await getAuthData();

    await db.expense.delete({
      where: { id },
    });

    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    return { error: "No se pudo eliminar el gasto" };
  }
}

export async function getExpensesByMonth(month: number, year: number) {
  const { businessId } = await getAuthData();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  return db.expense.findMany({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
