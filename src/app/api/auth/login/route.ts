import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = generateToken({
    userId: user.id,
    businessId: user.businessId,
    role: user.role,
  });
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return response;
}
