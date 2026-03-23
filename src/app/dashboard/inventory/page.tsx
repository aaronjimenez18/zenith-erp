import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import ProductForm from "../../../components/ProductForm";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { InventoryTable } from "./components/InventoryTable";

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
    <div className="p-4 md:p-6 pt-20 md:pt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los productos y niveles de stock de tu negocio.
          </p>
        </div>
        <ProductForm />
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <InventoryTable products={products} />
      </div>
    </div>
  );
}
