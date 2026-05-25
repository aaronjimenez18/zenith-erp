import { db } from "@/lib/db";
import { businessSchema } from "@/lib/validations";
import { z } from "zod";

export class BusinessService {
  constructor(private businessId: string) {}

  async get() {
    return db.business.findUnique({
      where: { id: this.businessId },
      select: {
        name: true,
        plan: true,
        marginsEnabled: true,
        profitMargin: true,
        wholesaleMargin: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        trialEnd: true,
        subscriptionEnd: true,
      },
    });
  }

  async update(input: z.infer<typeof businessSchema>) {
    const data = businessSchema.parse(input);
    return db.business.update({
      where: { id: this.businessId },
      data,
    });
  }

  async delete() {
    await db.$transaction([
      db.saleItem.deleteMany({ where: { sale: { businessId: this.businessId } } }),
      db.sale.deleteMany({ where: { businessId: this.businessId } }),
      db.expense.deleteMany({ where: { businessId: this.businessId } }),
      db.product.deleteMany({ where: { businessId: this.businessId } }),
      db.user.deleteMany({ where: { businessId: this.businessId } }),
      db.business.delete({ where: { id: this.businessId } }),
    ]);
  }

  async getUsers() {
    return db.user.findMany({
      where: { businessId: this.businessId },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async getStats() {
    const [totalProducts, totalSales, totalExpenses, todayRevenue] = await Promise.all([
      db.product.count({ where: { businessId: this.businessId } }),
      db.sale.aggregate({
        where: { businessId: this.businessId },
        _sum: { total: true },
      }),
      db.expense.aggregate({
        where: { businessId: this.businessId },
        _sum: { amount: true },
      }),
      db.sale.aggregate({
        where: {
          businessId: this.businessId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalProducts,
      totalRevenue: totalSales._sum.total || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      todayRevenue: todayRevenue._sum.total || 0,
    };
  }
}
