import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { TrendingUp, Package, AlertCircle, History, ShoppingCart } from "lucide-react";
import { TrendChart } from "@/components/trend-chart";
import { MarginSettings } from "@/components/margin-settings";

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
    <div className="min-h-screen p-4 md:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8 relative z-10">
      <header className="flex justify-between items-end flex-col md:flex-row gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Hola, <span className="capitalize">{userName}</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card p-5 sm:p-6 rounded-[22px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500/80">
                Ventas Totales
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 tabular-nums">
                $
                {(totalSales._sum.total || 0).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-primary/10 rounded-2xl backdrop-blur-sm text-primary border border-primary/20 shadow-sm">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">
            Acumulado histórico
          </p>
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-[22px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500/80">
                Productos
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 tabular-nums">{productsCount}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-primary/10 rounded-2xl backdrop-blur-sm text-primary border border-primary/20 shadow-sm">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">Items registrados</p>
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-[22px] relative overflow-hidden sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500/80">
                Alertas de Stock
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 tabular-nums">
                {lowStockProducts.length}{" "}
                <span className="text-base sm:text-lg font-medium text-slate-400">Críticos</span>
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-destructive/10 rounded-2xl backdrop-blur-sm text-destructive border border-destructive/20 shadow-sm">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">Requieren atención</p>
        </div>
      </div>

      <TrendChart data={chartData} />

      <MarginSettings />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Inventario en Riesgo */}
        <div className="glass-card rounded-3xl overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-white/40 bg-white/15">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
              Inventario en Riesgo
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-slate-500 font-medium text-sm py-4 text-center">
                Todo el stock está al día.
              </p>
            ) : (
              <div className="space-y-1">
                {lowStockProducts.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-3 sm:py-3.5 border-b border-white/40 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-xs font-bold text-slate-400 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-slate-700 truncate">{p.name}</span>
                    </div>
                    <span className="px-3 py-1 bg-white/40 backdrop-blur-sm text-destructive rounded-full text-xs font-extrabold border border-white/40 shrink-0 tabular-nums">
                      {p.stock} uds.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Últimos Movimientos - timeline style */}
        <div className="glass-card rounded-3xl overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-white/40 bg-white/15 flex items-center gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl text-primary">
              <History size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
              Últimos Movimientos
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-1">
              {recentSales.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center py-3 sm:py-3.5 border-b border-white/40 last:border-0"
                  >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                      <ShoppingCart size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        Venta
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-700 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/40 shrink-0 tabular-nums">
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
