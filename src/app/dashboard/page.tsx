import type { Metadata } from "next";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { env } from "@/lib/env";
import { ProductService } from "@/lib/services/product.service";
import { SaleService } from "@/lib/services/sale.service";
import { ExpenseService } from "@/lib/services/expense.service";
import { TrendingUp, TrendingDown, Minus, Package, AlertCircle, History, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TrendChart = dynamic(() => import("@/components/trend-chart").then((m) => ({ default: m.TrendChart })));

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let businessId: string;
  let userName: string = "Usuario";

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    businessId = payload.businessId as string;
    userName = (payload.name as string) || (payload.email as string)?.split("@")[0] || "Usuario";
  } catch {
    redirect("/login");
  }

  if (!businessId) redirect("/login");

  const productService = new ProductService(businessId);
  const saleService = new SaleService(businessId);
  const expenseService = new ExpenseService(businessId);

  const [
    productsCount,
    lowStockProducts,
    totalSales,
    recentSales,
    monthlySales,
    monthlyExpenses,
  ] = await Promise.all([
    db.product.count({ where: { businessId } }),
    productService.getLowStock(5).then(p => p.slice(0, 5)),
    db.sale.aggregate({
      where: { businessId },
      _sum: { total: true },
    }),
    saleService.getRecent(5),
    db.sale.findMany({
      where: { businessId },
      select: { total: true, createdAt: true },
    }),
    db.expense.findMany({
      where: { businessId },
      select: { amount: true, createdAt: true },
    }),
  ]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const calcMonthTotals = (month: number, year: number) => ({
    sales: monthlySales
      .filter(s => new Date(s.createdAt).getMonth() === month && new Date(s.createdAt).getFullYear() === year)
      .reduce((sum, s) => sum + (s.total || 0), 0),
    expenses: monthlyExpenses
      .filter(e => new Date(e.createdAt).getMonth() === month && new Date(e.createdAt).getFullYear() === year)
      .reduce((sum, e) => sum + (e.amount || 0), 0),
  });

  const currentTotals = calcMonthTotals(currentMonth, currentYear);
  const prevTotals = calcMonthTotals(prevMonth, prevYear);

  const calcTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const salesTrend = calcTrend(currentTotals.sales, prevTotals.sales);

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
        <div className="glass-card p-5 sm:p-6">
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
            <div className="p-2.5 sm:p-3 bg-[#134235]/10 rounded-2xl text-[#134235] shadow-sm">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
              salesTrend > 0 ? "text-green-600" : salesTrend < 0 ? "text-red-600" : "text-slate-400"
            }`}>
              {salesTrend > 0 ? <ArrowUpRight className="size-3" /> : salesTrend < 0 ? <ArrowDownRight className="size-3" /> : <Minus className="size-3" />}
              {salesTrend > 0 ? "+" : ""}{salesTrend}%
            </span>
            <span className="text-xs font-medium text-slate-400">vs mes anterior</span>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500/80">
                Productos
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 tabular-nums">{productsCount}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#134235]/10 rounded-2xl text-[#134235] shadow-sm">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">Items registrados</p>
        </div>

        <div className="glass-card p-5 sm:p-6 sm:col-span-2 md:col-span-1">
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
            <div className="p-2.5 sm:p-3 bg-red-50 rounded-2xl text-red-600 shadow-sm">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400">Requieren atención</p>
        </div>
      </div>

      <TrendChart data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Inventario en Riesgo */}
        <div className="glass-card overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-[#e3e2df]">
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
                    className="flex justify-between items-center py-3 sm:py-3.5 border-b border-[#e3e2df] last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-xs font-bold text-slate-400 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-slate-700 truncate">{p.name}</span>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-extrabold shrink-0 tabular-nums">
                      {p.stock} uds.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Últimos Movimientos - timeline style */}
        <div className="glass-card overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-[#e3e2df] flex items-center gap-3">
            <div className="p-1.5 sm:p-2 bg-[#134235]/10 rounded-xl text-[#134235]">
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
                    className="flex justify-between items-center py-3 sm:py-3.5 border-b border-[#e3e2df] last:border-0"
                  >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
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
                  <span className="text-sm font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl shrink-0 tabular-nums">
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
