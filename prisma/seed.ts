// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Limpiar datos viejos (opcional, para no duplicar)
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  // 2. Crear una Empresa
  const business = await prisma.business.create({
    data: {
      name: "Mi Tienda SaaS",
    },
  });

  // 3. Crear un Usuario Admin
  await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: "password123",
      role: "ADMIN",
      businessId: business.id,
    },
  });

  // 4. Crear Productos de prueba
  await prisma.product.createMany({
    data: [
      {
        name: "Producto A",
        sku: "PROD-A",
        price: 150.0,
        stock: 20,
        businessId: business.id,
      },
      {
        name: "Producto B",
        sku: "PROD-B",
        price: 85.5,
        stock: 50,
        businessId: business.id,
      },
      {
        name: "Producto C",
        sku: "PROD-C",
        price: 210.0,
        stock: 5,
        businessId: business.id,
      },
    ],
  });

  console.log("✅ ¡Base de datos sembrada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
