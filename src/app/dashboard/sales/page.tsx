import { db } from "@/lib/db";
import POS from "@/components/POS";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

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
    <div className="p-4 md:p-6 pt-20 md:pt-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
        <p className="text-gray-500">
          Registra ventas y descuenta stock automáticamente.
        </p>
      </header>

      <POS products={products} />
    </div>
  );
}