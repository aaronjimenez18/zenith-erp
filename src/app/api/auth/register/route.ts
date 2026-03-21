import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, name, email, password, plan } = body;

    // 1. Verificación manual (evita que Prisma truene por datos nulos)
    if (!email || !password || !name || !businessName) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Creación con manejo de Plan (aseguramos que sea el Enum correcto)
    const business = await db.business.create({
      data: {
        name: businessName,
        plan: plan === "PREMIUM" ? "PREMIUM" : "BASIC",
        users: {
          create: {
            name: name,
            email: email.toLowerCase(), // Normalizamos el email
            password: hashedPassword,
            role: "SUPER_ADMIN",
          },
        },
      },
      // Solo seleccionamos el ID para evitar errores de serialización
      select: { id: true } 
    });

    // 3. Respuesta limpia
    return NextResponse.json({ 
      success: true, 
      businessId: business.id 
    }, { status: 201 });

  } catch (error: any) {
    // IMPORTANTE: Esto te dirá el error real en tu terminal de VS Code
    console.error("DEBUG REGISTRO:", error);

    // Si el error es porque el email ya existe (P2002 es el código de Prisma)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}