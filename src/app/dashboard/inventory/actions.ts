"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// --- Función auxiliar para seguridad ---
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

// --- Acción: Crear Producto ---
export async function createProduct(formData: FormData) {
  try {
    const { businessId } = await getAuthData();

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);

    await db.product.create({
      data: { name, sku, price, stock, businessId },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    return { error: "No se pudo crear el producto" };
  }
}

// --- Acción: Registrar Venta (Descuenta Stock) ---
export async function createSale(
  items: { productId: string; quantity: number; price: number }[],
) {
  try {
    const { businessId } = await getAuthData();
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Usamos una transacción para garantizar integridad
    await db.$transaction(async (tx) => {
      // 1. Crear la Venta
      const sale = await tx.sale.create({
        data: {
          total,
          businessId,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // 2. Descontar Stock para cada producto
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para el producto: ${product?.name || item.productId}`,
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });

    revalidatePath("/dashboard/inventory"); // Actualiza la tabla de stock
    revalidatePath("/dashboard/sales"); // Actualiza el historial de ventas
    return { success: true };
  } catch (error: any) {
    console.error("Error en venta:", error);
    return { error: error.message || "Error al procesar la venta" };
  }
}
