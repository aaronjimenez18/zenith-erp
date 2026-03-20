import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const text = message.toLowerCase();

    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ text: "No autorizado" }, { status: 401 });

    const businessId = user.businessId;

    // INVENTARIO
    if (text.includes("inventario") || text.includes("stock tengo")) {
      const products = await db.product.findMany({ where: { businessId } });
      if (!products.length)
        return NextResponse.json({
          text: "No hay productos en tu inventario.",
        });

      const list = products
        .map((p) => `• ${p.name} — stock: ${p.stock} — $${p.price}`)
        .join("\n");
      return NextResponse.json({ text: `📦 Inventario actual:\n\n${list}` });
    }

    // PRODUCTOS CON POCO STOCK
    if (text.includes("stock bajo") || text.includes("poco stock")) {
      const products = await db.product.findMany({
        where: { businessId, stock: { lt: 5 } },
      });
      if (!products.length)
        return NextResponse.json({
          text: "No tienes productos con stock bajo.",
        });

      const list = products
        .map((p) => `• ${p.name} — stock: ${p.stock}`)
        .join("\n");
      return NextResponse.json({
        text: `⚠️ Productos con poco stock:\n\n${list}`,
      });
    }

    // VENTAS HOY
    if (text.includes("vendi hoy") || text.includes("ventas hoy")) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sales = await db.sale.findMany({
        where: { businessId, createdAt: { gte: today } },
      });
      const total = sales.reduce((a, s) => a + s.total, 0);
      return NextResponse.json({ text: `💰 Ventas de hoy: $${total}` });
    }

    // PRODUCTO MÁS VENDIDO
    if (text.includes("producto vendo mas")) {
      const items = await db.saleItem.findMany({
        include: { product: true, sale: true },
        where: { sale: { businessId } },
      });
      if (!items.length)
        return NextResponse.json({ text: "No hay ventas registradas." });
      const counter: Record<string, number> = {};
      items.forEach((i) => {
        counter[i.product.name] = (counter[i.product.name] || 0) + i.quantity;
      });
      const top = Object.entries(counter).sort((a, b) => b[1] - a[1])[0];
      return NextResponse.json({
        text: `🏆 Producto más vendido:\n\n${top[0]} (${top[1]} unidades)`,
      });
    }

    // GASTOS
    if (text.includes("gastos")) {
      const expenses = await db.expense.findMany({ where: { businessId } });
      const total = expenses.reduce((a, e) => a + e.amount, 0);
      return NextResponse.json({ text: `🧾 Gastos totales: $${total}` });
    }

    // CREAR PRODUCTO
    if (text.includes("crear producto")) {
      const parts = message.split(",");
      if (parts.length < 3)
        return NextResponse.json({
          text: "Usa: crear producto nombre,precio,stock",
        });

      const name = parts[0].replace("crear producto", "").trim();
      const price = Number(parts[1]);
      const stock = Number(parts[2]);
      const sku =
        name.toUpperCase().replaceAll(" ", "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      const product = await db.product.create({
        data: { name, sku, price, stock, businessId },
      });

      return NextResponse.json({
        text: `✅ Producto creado\nNombre: ${product.name}\nStock: ${product.stock}\nPrecio: $${product.price}`,
      });
    }

    // ANALISIS NEGOCIO
    if (text.includes("analiza") || text.includes("negocio")) {
      const sales = await db.sale.findMany({ where: { businessId } });
      const expenses = await db.expense.findMany({ where: { businessId } });
      const revenue = sales.reduce((a, s) => a + s.total, 0);
      const costs = expenses.reduce((a, e) => a + e.amount, 0);
      const profit = revenue - costs;
      return NextResponse.json({
        text: `📊 Análisis del negocio\nIngresos: $${revenue}\nGastos: $${costs}\nGanancia: $${profit}`,
      });
    }

    return NextResponse.json({
      text:
        "🤖 Zenith AI Copilot\n\n" +
        "Puedes preguntarme:\n" +
        "• que stock tengo\n" +
        "• que productos tienen poco stock\n" +
        "• cuanto vendi hoy\n" +
        "• que producto vendo mas\n" +
        "• analiza mi negocio\n" +
        "• crear producto teclado,50,10",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: "Error del asistente" }, { status: 500 });
  }
}
