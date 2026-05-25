import { jwtVerify } from "jose";
import { unauthorized } from "./response";
import { env } from "@/lib/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export type AuthPayload = {
  userId: string;
  name: string;
  businessId: string;
  role: string;
  plan: string;
};

export async function getAuth(req: Request): Promise<AuthPayload> {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) throw new Error("No token");

  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as AuthPayload;
}

export async function requireAuth(req: Request) {
  try {
    return await getAuth(req);
  } catch {
    return null;
  }
}

export type Role = "SUPER_ADMIN" | "ADMIN" | "VENDEDOR";

const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  VENDEDOR: 1,
};

export function hasRole(user: AuthPayload, minRole: Role): boolean {
  return ROLE_HIERARCHY[user.role as Role] >= ROLE_HIERARCHY[minRole];
}

export function handleAuth(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return unauthorized();
  return auth;
}
