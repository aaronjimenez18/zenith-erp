import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Este email ya ha sido verificado" },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry: tokenExpiry,
      },
    });

    const emailResult = await sendVerificationEmail(
      normalizedEmail,
      verificationToken,
      user.name
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Email de verificación enviado",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
