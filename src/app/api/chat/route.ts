import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { askAI } from "@/lib/ai/agent";

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const businessId = user.businessId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [products, monthSales, lastMonthSales, monthExpenses, lastMonthExpenses, totalSales, todaySales] = 
      await Promise.all([
        db.product.count({ where: { businessId } }),
        db.sale.aggregate({
          where: { businessId, createdAt: { gte: startOfMonth } },
          _sum: { total: true },
        }),
        db.sale.aggregate({
          where: { businessId, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
          _sum: { total: true },
        }),
        db.expense.aggregate({
          where: { businessId, createdAt: { gte: startOfMonth } },
          _sum: { amount: true },
        }),
        db.expense.aggregate({
          where: { businessId, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
          _sum: { amount: true },
        }),
        db.sale.count({ where: { businessId } }),
        db.sale.findMany({
          where: { businessId, createdAt: { gte: new Date(now.setHours(0,0,0,0)) } },
          select: { total: true },
        }),
      ]);

    const monthRevenue = monthSales._sum.total || 0;
    const lastMonthRevenue = lastMonthSales._sum.total || 0;
    const monthExpensesAmount = monthExpenses._sum.amount || 0;
    const lastMonthExpensesAmount = lastMonthExpenses._sum.amount || 0;

    return NextResponse.json({
      revenue: monthRevenue,
      revenueChange: lastMonthRevenue ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0,
      salesCount: totalSales,
      todayRevenue: todaySales.reduce((a, s) => a + s.total, 0),
      expenses: monthExpensesAmount,
      expensesChange: lastMonthExpensesAmount ? ((monthExpensesAmount - lastMonthExpensesAmount) / lastMonthExpensesAmount) * 100 : 0,
      productsCount: products,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ text: "No autorizado" }, { status: 401 });

    const businessId = user.businessId;

    // Acciones rápidas que no requieren IA
    if (message.toLowerCase().includes("crear producto")) {
      const parts = message.split(",");
      if (parts.length < 3) {
        const aiResponse = await askAI(
          "El usuario quiere crear un producto pero no dio todos los datos. Pide el nombre, precio y stock separados por comas.",
          {
            products: [],
            todaySales: 0,
            totalSales: 0,
            expenses: 0,
            topProducts: [],
          }
        );
        return NextResponse.json({ text: aiResponse });
      }

      const name = message.split(",")[0].replace(/crear producto/gi, "").trim();
      const price = Number(message.split(",")[1]);
      const stock = Number(message.split(",")[2]);

      if (isNaN(price) || isNaN(stock)) {
        return NextResponse.json({
          text: "Precio y stock deben ser números. Ejemplo: crear producto nombre,50,10",
        });
      }

      const sku =
        name.toUpperCase().replaceAll(" ", "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      await db.product.create({
        data: { name, sku, price, wholesalePrice: price * 0.85, stock, businessId },
      });

      return NextResponse.json({
        text:
          "Producto creado exitosamente:\n" +
          "- Nombre: " +
          name +
          "\n" +
          "- Stock: " +
          stock +
          "\n" +
          "- Precio: $" +
          price,
      });
    }

    // Cargar contexto del negocio para la IA
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [products, todaySalesData, allSales, expenses, saleItems] =
      await Promise.all([
        db.product.findMany({
          where: { businessId },
          select: { name: true, stock: true, price: true, wholesalePrice: true },
        }),
        db.sale.findMany({
          where: { businessId, createdAt: { gte: today } },
          select: { total: true },
        }),
        db.sale.findMany({
          where: { businessId },
          select: { total: true },
        }),
        db.expense.findMany({
          where: { businessId },
          select: { amount: true },
        }),
        db.saleItem.findMany({
          include: { product: { select: { name: true } }, sale: true },
          where: { sale: { businessId } },
        }),
      ]);

    const todaySales = todaySalesData.reduce((a, s) => a + s.total, 0);
    const totalSales = allSales.reduce((a, s) => a + s.total, 0);
    const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);

    const productCounter: Record<string, number> = {};
    saleItems.forEach((item) => {
      const name = item.product.name;
      productCounter[name] = (productCounter[name] || 0) + item.quantity;
    });
    const topProducts = Object.entries(productCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    // Llamar a la IA con el contexto completo
    const aiResponse = await askAI(
      message,
      {
        products,
        todaySales,
        totalSales,
        expenses: totalExpenses,
        topProducts,
      },
      history || []
    );

    return NextResponse.json({ text: aiResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { text: "Error del asistente. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
