import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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

  // Consultas paralelas para el Dashboard
  const [productsCount, lowStockProducts, totalSales, recentSales] =
    await Promise.all([
      db.product.count({ where: { businessId } }),
      db.product.findMany({
        where: { businessId, stock: { lte: 5 } },
        take: 5,
      }),
      db.sale.aggregate({
        where: { businessId },
        _sum: { total: true },
      }),
      db.sale.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
    ]);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-500">
          Resumen general de tu negocio en tiempo real.
        </p>
      </header>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
          <p className="text-2xl font-bold text-green-600">
            ${totalSales._sum.total?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Productos en Catálogo
          </p>
          <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Alertas de Stock</p>
          <p
            className={`text-2xl font-bold ${lowStockProducts.length > 0 ? "text-red-500" : "text-green-500"}`}
          >
            {lowStockProducts.length} críticos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productos con Bajo Stock */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Stock Crítico</h2>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Todo el stock está al día.
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center text-sm border-b pb-2"
                >
                  <span>{p.name}</span>
                  <span className="font-bold text-red-600">
                    {p.stock} unidades
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ventas Recientes */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentSales.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center text-sm border-b pb-2"
              >
                <span className="text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
                <span className="font-medium text-gray-900">
                  ${s.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
