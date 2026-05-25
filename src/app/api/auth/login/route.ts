import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { login } from "@/lib/services/auth.service";
import { badRequest, unauthorized, serverError, tooMany } from "@/lib/api/response";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    const body = await req.json().catch(() => ({}));

    const ipLimit = rateLimit({ key: `login:${ip}`, limit: 20, windowMs: 60000 });
    if (!ipLimit.allowed) return tooMany("Demasiados intentos. Intenta de nuevo en 1 minuto.");

    if (body.email) {
      const emailLimit = rateLimit({ key: `login:${body.email}`, limit: 5, windowMs: 60000 });
      if (!emailLimit.allowed) return tooMany("Demasiados intentos para esta cuenta.");
    }

    const result = await login(body);

    if (!result.success) return result.status === 401 ? unauthorized(result.error) : badRequest(result.error);

    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    response.headers.set(
      "Set-Cookie",
      `token=${result.token}; HttpOnly; Secure=${env.NODE_ENV === "production"}; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    );

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return serverError();
  }
}