import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password, businessName } = await req.json();

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    // 1. Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 },
      );
    }

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Transacción: Crear empresa y luego usuario
    // Usamos una transacción para que si algo falla, no se cree la empresa sin el usuario
    const result = await db.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: businessName,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          businessId: business.id,
          role: "ADMIN", // Asignamos rol de admin por defecto al creador
        },
      });

      return { user, business };
    });

    // No devolvemos el password en la respuesta por seguridad
    const { password: _, ...userWithoutPassword } = result.user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        business: result.business,
        message: "Registro completado con éxito",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta" },
      { status: 500 },
    );
  }
}
