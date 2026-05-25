import { db } from "@/lib/db";
import { expenseSchema, updateExpenseSchema } from "@/lib/validations";
import { z } from "zod";

export class ExpenseService {
  constructor(private businessId: string) {}

  async list() {
    return db.expense.findMany({
      where: { businessId: this.businessId },
    });
  }

  async getByMonth(month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    return db.expense.findMany({
      where: {
        businessId: this.businessId,
        createdAt: { gte: start, lte: end },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(input: z.infer<typeof expenseSchema>) {
    const data = expenseSchema.parse(input);
    return db.expense.create({
      data: { ...data, businessId: this.businessId },
    });
  }

  async update(id: string, input: z.infer<typeof updateExpenseSchema>) {
    const data = updateExpenseSchema.parse(input);
    const exists = await db.expense.findFirst({
      where: { id, businessId: this.businessId },
    });
    if (!exists) return null;
    return db.expense.update({ where: { id }, data });
  }

  async delete(id: string) {
    const exists = await db.expense.findFirst({
      where: { id, businessId: this.businessId },
    });
    if (!exists) return null;
    return db.expense.delete({ where: { id } });
  }

  async getTotal(month?: number, year?: number) {
    const where: Record<string, unknown> = { businessId: this.businessId };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      where.createdAt = { gte: start, lte: end };
    }
    const result = await db.expense.aggregate({
      where,
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}
