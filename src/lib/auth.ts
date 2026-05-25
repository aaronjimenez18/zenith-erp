import { cookies } from "next/headers";
import { verifyToken } from "@/lib/services/auth.service";
export { generateToken } from "@/lib/services/auth.service";
export type { TokenPayload } from "@/lib/services/auth.service";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}