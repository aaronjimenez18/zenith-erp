"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";
import { ProductService } from "@/lib/services/product.service";
import { SaleService } from "@/lib/services/sale.service";

async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");

  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return {
    businessId: payload.businessId as string,
    userId: payload.userId as string,
  };
}

export async function createProduct(formData: FormData) {
  try {
    const { businessId } = await getAuthData();
    const service = new ProductService(businessId);

    await service.create({
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      wholesalePrice: parseFloat(formData.get("wholesalePrice") as string) || 0,
      purchasePrice: parseFloat(formData.get("purchasePrice") as string) || 0,
      stock: parseInt(formData.get("stock") as string) || 0,
      barcode: (formData.get("barcode") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al crear producto";
    console.error("Error creando producto:", error);
    return { error: message };
  }
}

export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    sku?: string;
    price?: number;
    wholesalePrice?: number;
    purchasePrice?: number;
    stock?: number;
    barcode?: string | null;
    imageUrl?: string | null;
  }
) {
  try {
    const { businessId } = await getAuthData();
    const service = new ProductService(businessId);

    const result = await service.update(productId, {
      ...data,
      barcode: data.barcode ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
    });

    if (!result) return { error: "Producto no encontrado" };

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar producto";
    console.error("Error actualizando producto:", error);
    return { error: message };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const { businessId } = await getAuthData();
    const service = new ProductService(businessId);

    const result = await service.delete(productId);
    if (!result) return { error: "Producto no encontrado" };

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar producto";
    console.error("Error eliminando producto:", error);
    return { error: message };
  }
}

export async function createSale(
  items: { productId: string; quantity: number; price: number }[],
) {
  try {
    const { businessId } = await getAuthData();
    const service = new SaleService(businessId);
    await service.create({ items });

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/sales");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al procesar la venta";
    console.error("Error en venta:", error);
    return { error: message };
  }
}
