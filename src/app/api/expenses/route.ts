import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return {
    businessId: payload.businessId as string,
    userId: payload.userId as string,
  };
}

export async function GET() {
  try {
    let businessId: string;
    
    try {
      const authData = await getAuthData();
      businessId = authData.businessId;
    } catch {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const expenses = await db.expense.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 });
  }
}
