import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { Role, Plan } from "@prisma/client";

// GET: Listar usuarios de la empresa
export async function GET() {
  const session = await getUserFromToken();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const users = await db.user.findMany({
    where: { businessId: session.businessId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}

// POST: Crear nuevo empleado
export async function POST(req: Request) {
  try {
    const session = await getUserFromToken();
    if (!session || session.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { email, password, role } = await req.json();

    // Validación de Plan
    if (session.plan === Plan.BASIC && role === Role.ADMIN) {
      return NextResponse.json(
        { error: "El rol ADMIN requiere Plan PREMIUM" },
        { status: 403 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as Role,
        businessId: session.businessId,
      },
    });

    return NextResponse.json({ message: "Usuario creado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}

// DELETE: Eliminar usuario
export async function DELETE(req: Request) {
  try {
    const session = await getUserFromToken();
    if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    const userToDelete = await db.user.findUnique({ where: { id: userId } });
    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (userToDelete.role === Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "No puedes eliminar un SUPER_ADMIN" }, { status: 403 });
    }

    if (userToDelete.businessId !== session.businessId) {
      return NextResponse.json({ error: "No puedes eliminar usuarios de otro negocio" }, { status: 403 });
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}