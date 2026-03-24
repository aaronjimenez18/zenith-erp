import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, name, email, password, plan } = body;

    if (!email || !password || !name || !businessName) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const business = await db.business.create({
      data: {
        name: businessName,
        plan: plan === "PREMIUM" ? "PREMIUM" : "BASIC",
        users: {
          create: {
            name: name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            verificationToken,
            verificationTokenExpiry: tokenExpiry,
          },
        },
      },
      select: { id: true },
    });

    await sendVerificationEmail(normalizedEmail, verificationToken, name);

    return NextResponse.json({
      success: true,
      message: "Usuario creado. Por favor verifica tu correo electrónico.",
      emailSent: true,
    }, { status: 201 });

  } catch (error) {
    const err = error as { code?: string };
    console.error("DEBUG REGISTRO:", error);

    if (err.code === "P2002") {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}