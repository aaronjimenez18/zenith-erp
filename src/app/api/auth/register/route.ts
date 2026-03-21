import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { businessName, name, email, password, plan } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const business = await db.business.create({
      data: {
        name: businessName,
        plan: plan, 
        users: {
          create: {
            name: name, 
            email: email,
            password: hashedPassword,
            role: "SUPER_ADMIN",
          },
        },
      },
    });

    return NextResponse.json({ success: true, businessId: business.id });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}