import { db } from "@/lib/db";
import { saleSchema } from "@/lib/validations";
import { z } from "zod";

export class SaleService {
  constructor(private businessId: string) {}

  async create(input: z.infer<typeof saleSchema>) {
    const { items } = saleSchema.parse(input);

    return db.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product?.name || "producto"}`);
        }
      }

      const sale = await tx.sale.create({
        data: {
          total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          businessId: this.businessId,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return sale;
    });
  }

  async getRecent(limit = 10) {
    return db.sale.findMany({
      where: { businessId: this.businessId },
      include: { items: { include: { product: { select: { name: true } } } } },
      take: limit,
    });
  }

  async getTodayTotal() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await db.sale.aggregate({
      where: {
        businessId: this.businessId,
        createdAt: { gte: start, lte: end },
      },
      _sum: { total: true },
    });
    return result._sum.total || 0;
  }

  async getMonthlyTotal(month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const result = await db.sale.aggregate({
      where: {
        businessId: this.businessId,
        createdAt: { gte: start, lte: end },
      },
      _sum: { total: true },
    });
    return result._sum.total || 0;
  }
}
