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
    const purchasePrice = parseFloat(formData.get("purchasePrice") as string) || 0;
    const stock = parseInt(formData.get("stock") as string);
    const barcode = (formData.get("barcode") as string) || null;
    const imageUrl = (formData.get("imageUrl") as string) || null;

    await db.product.create({
      data: { name, sku, price, purchasePrice, stock, barcode, imageUrl, businessId },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Error creando producto:", error);
    return { error: error.message || "No se pudo crear el producto" };
  }
}

// --- Acción: Actualizar Producto ---
export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    sku?: string;
    price?: number;
    purchasePrice?: number;
    stock?: number;
    barcode?: string | null;
    imageUrl?: string | null;
  }
) {
  try {
    const { businessId } = await getAuthData();

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.businessId !== businessId) {
      return { error: "Producto no encontrado" };
    }

    await db.product.update({
      where: { id: productId },
      data,
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Error actualizando producto:", error);
    return { error: error.message || "No se pudo actualizar el producto" };
  }
}

// --- Acción: Eliminar Producto ---
export async function deleteProduct(productId: string) {
  try {
    const { businessId } = await getAuthData();

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.businessId !== businessId) {
      return { error: "Producto no encontrado" };
    }

    await db.product.delete({
      where: { id: productId },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Error eliminando producto:", error);
    return { error: error.message || "No se pudo eliminar el producto" };
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
