import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // Extraemos el payload del token decodificado
    const { payload } = await jwtVerify(token, secret);
    
    const role = payload.role as string;

    // --- REGLAS DE ACCESO ---

    // 1. Si un VENDEDOR intenta entrar a rutas de configuración o reportes
    const restrictedForVendedor = ["/dashboard/usuarios", "/dashboard/reportes", "/dashboard/configuracion"];
    
    if (role === "VENDEDOR" && restrictedForVendedor.some(path => pathname.startsWith(path))) {
      // Lo mandamos a la parte que sí puede ver (el punto de venta o inventario básico)
      return NextResponse.redirect(new URL("/dashboard/ventas", req.url));
    }

    // 2. Si un ADMIN (Gerente) intenta entrar a la gestión de suscripciones (Solo Super Admin)
    if (role === "ADMIN" && pathname.startsWith("/dashboard/suscripcion")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};