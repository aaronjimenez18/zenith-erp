import type { Metadata } from "next";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const POS = dynamic(() => import("@/components/pos"));

export const metadata: Metadata = {
  title: "Punto de Venta",
  robots: { index: false, follow: false },
};

export default async function SalesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  let businessId: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    businessId = payload.businessId as string;
  } catch {
    redirect("/login");
  }

  // Traemos los productos para que el POS los muestre
  const products = await db.product.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 relative z-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Punto de Venta</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Registra ventas y descuenta stock automáticamente.
        </p>
      </header>

      <POS products={products} />
    </div>
  );
}