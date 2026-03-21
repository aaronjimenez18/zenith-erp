import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Retornamos los datos necesarios para la UI
    return NextResponse.json({
      role: user.role,
      plan: user.plan,
      userId: user.userId,
      businessId: user.businessId
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}