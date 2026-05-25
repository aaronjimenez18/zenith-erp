import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const registerSchema = z.object({
  businessName: z.string().min(1, "Nombre de empresa requerido"),
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  plan: z.enum(["BASIC", "PREMIUM"]).default("BASIC"),
  interval: z.enum(["month", "annual"]).default("month"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  sku: z.string().min(1, "SKU requerido"),
  barcode: z.string().optional(),
  price: z.coerce.number().positive("Precio debe ser positivo"),
  wholesalePrice: z.coerce.number().min(0).optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, "Stock no puede ser negativo"),
  imageUrl: z.string().optional(),
});

export const updateProductSchema = productSchema.partial();

export const expenseSchema = z.object({
  description: z.string().min(1, "Descripción requerida"),
  amount: z.coerce.number().positive("Monto debe ser positivo"),
  category: z.string().min(1, "Categoría requerida"),
});

export const updateExpenseSchema = expenseSchema.partial();

export const userSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").optional(),
  role: z.enum(["ADMIN", "VENDEDOR"]),
});

export const businessSchema = z.object({
  name: z.string().min(1).optional(),
  marginsEnabled: z.boolean().optional(),
  profitMargin: z.coerce.number().min(0).max(100).optional(),
  wholesaleMargin: z.coerce.number().min(0).max(100).optional(),
});

export const saleSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().positive(),
  })).min(1, "Debe tener al menos un producto"),
});
