import type { Metadata } from "next";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import type { Product } from "@prisma/client";
import ProductForm from "@/components/product-form";
import { InventoryTable } from "./components/inventory-table";

export const metadata: Metadata = {
  title: "Inventario",
  robots: { index: false, follow: false },
};

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let businessId: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    businessId = payload.businessId as string;
  } catch (error) {
    console.error("JWT Verification failed", error);
    redirect("/login");
  }

  const products: Product[] = await db.product.findMany({
    where: {
      businessId: businessId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Inventario
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Gestiona los productos y niveles de stock de tu negocio.
          </p>
        </div>
        <ProductForm />
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <InventoryTable products={products} />
      </div>
    </div>
  );
}
