import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const token = await getUserFromToken()
    if (!token?.businessId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const products = await db.product.findMany({
      where: {
        businessId: token.businessId,
        stock: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        wholesalePrice: true,
        stock: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'No se pudieron cargar los productos' }, { status: 500 })
  }
}