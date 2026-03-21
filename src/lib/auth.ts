import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role, Plan } from "@prisma/client"; // Importamos los tipos reales

const JWT_SECRET = process.env.JWT_SECRET!;

// Actualizamos el tipo para que acepte el plan y use los Enums de Prisma
type TokenPayload = {
  userId: string;
  name: string;
  businessId: string;
  role: Role;   
  plan: Plan;   
};

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}