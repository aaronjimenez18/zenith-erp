import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // 1. Si no hay token, al login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 2. Verificar el token con jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // 3. Si es válido, permitir el paso
    return NextResponse.next();
  } catch (error) {
    // 4. Si el token es inválido o expiró, al login
    console.error("JWT Middleware Error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Se aplica a todas las rutas que empiecen con /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
