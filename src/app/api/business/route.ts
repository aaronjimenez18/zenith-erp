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

async function getUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload.role as string;
}

export async function GET() {
  try {
    const businessId = await getBusinessId();
    if (!businessId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const business = await db.business.findUnique({
      where: { id: businessId },
      select: { name: true, plan: true, marginsEnabled: true, profitMargin: true, wholesaleMargin: true },
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

    const body = await req.json();
    const data: Record<string, any> = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
      }
      data.name = body.name.trim();
    }
    if (body.marginsEnabled !== undefined) {
      if (typeof body.marginsEnabled !== "boolean") {
        return NextResponse.json({ error: "Valor inválido para márgenes" }, { status: 400 });
      }
      data.marginsEnabled = body.marginsEnabled;
    }
    if (body.profitMargin !== undefined) {
      if (typeof body.profitMargin !== "number") {
        return NextResponse.json({ error: "Margen de ganancia inválido" }, { status: 400 });
      }
      data.profitMargin = body.profitMargin;
    }
    if (body.wholesaleMargin !== undefined) {
      if (typeof body.wholesaleMargin !== "number") {
        return NextResponse.json({ error: "Margen de mayoreo inválido" }, { status: 400 });
      }
      data.wholesaleMargin = body.wholesaleMargin;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    const business = await db.business.update({
      where: { id: businessId },
      data,
      select: { name: true, plan: true, marginsEnabled: true, profitMargin: true, wholesaleMargin: true },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const businessId = await getBusinessId();
    if (!businessId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const role = await getUserRole();
    if (role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Solo el Super Admin puede eliminar el negocio" }, { status: 403 });
    }

    await db.$transaction(async (tx) => {
      await tx.saleItem.deleteMany({ where: { sale: { businessId } } });
      await tx.sale.deleteMany({ where: { businessId } });
      await tx.expense.deleteMany({ where: { businessId } });
      await tx.product.deleteMany({ where: { businessId } });
      await tx.user.deleteMany({ where: { businessId } });
      await tx.business.delete({ where: { id: businessId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
