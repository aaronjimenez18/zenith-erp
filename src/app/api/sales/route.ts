import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Trae todos los productos con stock > 0
    const products = await db.product.findMany({
      where: {
        stock: { gt: 0 } // opcional, si quieres mostrar solo los disponibles
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudieron cargar los productos' }, { status: 500 })
  }
}