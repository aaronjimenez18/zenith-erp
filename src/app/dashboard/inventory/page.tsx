import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import ProductForm from "../../../components/ProductForm";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  // 1. Obtener el token de las cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login"); // Redirigir si no hay sesión
  }

  let businessId: string;

  try {
    // 2. Decodificar el token para obtener el ID del negocio del usuario actual
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    businessId = payload.businessId as string;
  } catch (error) {
    console.error("JWT Verification failed", error);
    redirect("/login");
  }

  // 3. Filtrar los productos por businessId
  const products: Product[] = await db.product.findMany({
    where: {
      businessId: businessId, // CRÍTICO: Solo mostramos lo que pertenece a este negocio
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los productos y niveles de stock de tu negocio.
          </p>
        </div>

        {/* Pasamos el businessId como prop opcional si tu formulario lo requiere */}
        <ProductForm />
      </div>

      {/* Tabla de Productos */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left tracking-wider">SKU</th>
              <th className="px-6 py-3 text-right tracking-wider">Precio</th>
              <th className="px-6 py-3 text-right tracking-wider">Stock</th>
              <th className="px-6 py-3 text-center tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">📦</span>
                    <p>No hay productos registrados aún.</p>
                    <p className="text-sm">
                      Haz clic en "+ Nuevo Producto" para comenzar.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-sm">
                    {product.sku}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-gray-900 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock > 10
                        ? "En Stock"
                        : product.stock > 0
                          ? "Bajo Stock"
                          : "Agotado"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
