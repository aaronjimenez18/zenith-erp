// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Esto evita que Next.js cree múltiples instancias en desarrollo
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // opcional, útil para ver las consultas en consola
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma