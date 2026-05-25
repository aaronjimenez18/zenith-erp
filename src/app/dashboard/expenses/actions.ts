"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";
import { ExpenseService } from "@/lib/services/expense.service";

async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estas autenticado");

  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return {
    businessId: payload.businessId as string,
    userId: payload.userId as string,
  };
}

export async function seedDefaultExpenses() {
  try {
    const { businessId } = await getAuthData();
    const service = new ExpenseService(businessId);
    const existing = await service.list();

    if (existing.length > 0) {
      return { success: true, created: false };
    }

    revalidatePath("/dashboard/expenses");
    return { success: true, created: true };
  } catch (error) {
    console.error("Error al crear gastos predefinidos:", error);
    return { error: "No se pudieron crear los gastos predefinidos" };
  }
}

export async function createExpense(formData: FormData) {
  try {
    const { businessId } = await getAuthData();
    const service = new ExpenseService(businessId);

    await service.create({
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string) || 0,
      category: formData.get("category") as string,
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
    const { businessId } = await getAuthData();
    const service = new ExpenseService(businessId);

    const result = await service.update(id, {
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string) || 0,
      category: formData.get("category") as string,
    });

    if (!result) return { error: "Gasto no encontrado" };

    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    return { error: "No se pudo actualizar el gasto" };
  }
}

export async function deleteExpense(id: string) {
  try {
    const { businessId } = await getAuthData();
    const service = new ExpenseService(businessId);

    const result = await service.delete(id);
    if (!result) return { error: "Gasto no encontrado" };

    revalidatePath("/dashboard/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    return { error: "No se pudo eliminar el gasto" };
  }
}

export async function getExpensesByMonth(month: number, year: number) {
  const { businessId } = await getAuthData();
  const service = new ExpenseService(businessId);
  return service.getByMonth(month, year);
}
