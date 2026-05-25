import { db } from "@/lib/db";
import { productSchema, updateProductSchema } from "@/lib/validations";
import { z } from "zod";

export class ProductService {
  constructor(private businessId: string) {}

  async list() {
    return db.product.findMany({
      where: { businessId: this.businessId },
    });
  }

  async getById(id: string) {
    return db.product.findFirst({
      where: { id, businessId: this.businessId },
    });
  }

  async search(query: string) {
    return db.product.findMany({
      where: {
        businessId: this.businessId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          { barcode: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }

  async create(input: z.infer<typeof productSchema>) {
    const data = productSchema.parse(input);
    return db.product.create({
      data: { ...data, businessId: this.businessId },
    });
  }

  async update(id: string, input: z.infer<typeof updateProductSchema>) {
    const data = updateProductSchema.parse(input);
    const exists = await this.getById(id);
    if (!exists) return null;
    return db.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    const exists = await this.getById(id);
    if (!exists) return null;
    return db.product.delete({ where: { id } });
  }

  async getLowStock(threshold = 10) {
    return db.product.findMany({
      where: { businessId: this.businessId, stock: { lte: threshold } },
      orderBy: { stock: "asc" },
    });
  }
}
