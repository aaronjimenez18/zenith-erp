import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { TrendingUp, Package, AlertCircle, History } from "lucide-react";
import { TrendChart } from "@/components/TrendChart";
import { MarginSettings } from "@/components/MarginSettings";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Si no hay token, al login directamente
  if (!token) redirect("/login");

  let businessId: string;
  let userName: string = "Usuario";

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    businessId = payload.businessId as string;

    // Intentamos sacar el nombre, si no, el email, si no, se queda como "Usuario"
    if (payload.name) {
      userName = payload.name as string;
    } else if (payload.email) {
      userName = (payload.email as string).split("@")[0];
    }
  } catch {
    redirect("/login");
  }

  // Si por alguna razón no tenemos businessId, no podemos consultar la DB
  if (!businessId) redirect("/login");

  const [
    productsCount,
    lowStockProducts,
    totalSales,
    recentSales,
    monthlySales,
    monthlyExpenses,
  ] = await Promise.all([
    db.product.count({ where: { businessId } }),
    db.product.findMany({
      where: { businessId, stock: { lte: 5 } },
      take: 5,
      orderBy: { stock: "asc" },
    }),
    db.sale.aggregate({
      where: { businessId },
      _sum: { total: true },
    }),
    db.sale.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.sale.findMany({
      where: { businessId },
      select: { total: true, createdAt: true },
    }),
    db.expense.findMany({
      where: { businessId },
      select: { amount: true, createdAt: true },
    }),
  ]);

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const chartData = months.map((month, index) => {
    const monthNum = index + 1;
    const currentYear = new Date().getFullYear();

    const monthSales = monthlySales
      .filter((s) => {
        const date = new Date(s.createdAt);
        return (
          date.getMonth() + 1 === monthNum && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, s) => sum + (s.total || 0), 0);

    const monthExpenses = monthlyExpenses
      .filter((e) => {
        const date = new Date(e.createdAt);
        return (
          date.getMonth() + 1 === monthNum && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
      name: month,
      ingresos: monthSales,
      gastos: monthExpenses,
    };
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-6 md:space-y-10 pt-20 md:pt-8">
      <header className="flex justify-between items-end flex-col md:flex-row gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1 capitalize">
            {new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Hola, <span className="text-blue-600 capitalize">{userName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Resumen de tu negocio.</p>
        </div>
      </header>

      <TrendChart data={chartData} />

      <MarginSettings />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Ventas Totales
            </p>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            $
            {(totalSales._sum.total || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-green-600 mt-2 font-medium">
            Acumulado histórico
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Productos
            </p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{productsCount}</p>
          <p className="text-xs text-slate-400 mt-2">Items registrados</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Alertas de Stock
            </p>
            <div
              className={`p-2 rounded-lg ${lowStockProducts.length > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
            >
              <AlertCircle size={20} />
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${lowStockProducts.length > 0 ? "text-red-500" : "text-emerald-600"}`}
          >
            {lowStockProducts.length}{" "}
            <span className="text-xl font-medium">Críticos</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">Requieren atención</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventario */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <div className="w-2 h-6 bg-red-500 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">
              Inventario en Riesgo
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {lowStockProducts.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center">
                  Todo el stock está al día.
                </p>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0"
                  >
                    <span className="font-medium text-slate-700">{p.name}</span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">
                      {p.stock} unidades
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Movimientos */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">
              Últimos Movimientos
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {recentSales.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <History size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Venta Registrada
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    +$
                    {(s.total || 0).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
