import { db } from "@/lib/db";

export async function getLowStockProducts() {
  return db.product.findMany({
    where: {
      stock: {
        lt: 5,
      },
    },
  });
}

export async function searchProduct(keyword: string) {
  return db.product.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });
}
