import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

async function getBusinessId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload.businessId as string;
}

export async function GET() {
  try {
    const businessId = await getBusinessId();
    if (!businessId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const business = await db.business.findUnique({
      where: { id: businessId },
      select: { profitMargin: true, wholesaleMargin: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const businessId = await getBusinessId();
    if (!businessId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { profitMargin, wholesaleMargin } = await req.json();

    if (typeof profitMargin !== "number" || typeof wholesaleMargin !== "number") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const business = await db.business.update({
      where: { id: businessId },
      data: { profitMargin, wholesaleMargin },
      select: { profitMargin: true, wholesaleMargin: true },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
