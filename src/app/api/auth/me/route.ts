import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tokenUser = await getUserFromToken();

    if (!tokenUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [dbUser, business] = await Promise.all([
      db.user.findUnique({
        where: { id: tokenUser.userId },
        select: { name: true, email: true, role: true },
      }),
      db.business.findUnique({
        where: { id: tokenUser.businessId },
        select: { name: true, plan: true },
      }),
    ]);

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      plan: business?.plan || tokenUser.plan,
      userId: tokenUser.userId,
      businessId: tokenUser.businessId,
      businessName: business?.name || "Mi Negocio",
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const tokenUser = await getUserFromToken();
    if (!tokenUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name } = await req.json();

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: tokenUser.userId },
      data: { name: name.trim() },
      select: { name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}