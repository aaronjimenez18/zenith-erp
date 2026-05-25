import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { env } from "@/lib/env";
import { loginSchema, registerSchema } from "@/lib/validations";
import { z } from "zod";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export type TokenPayload = {
  userId: string;
  name: string;
  businessId: string;
  role: string;
  plan: string;
};

export async function generateToken(payload: TokenPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function login(input: z.infer<typeof loginSchema>): Promise<
  { success: false; error: string; status: 400 | 401 } | { success: true; token: string; user: { name: string | null; email: string; role: string } }
> {
  try {
    const { email, password } = loginSchema.parse(input);

    const user = await db.user.findUnique({
      where: { email },
      include: { business: { select: { plan: true } } },
    });

    if (!user) return { success: false, error: "Credenciales inválidas", status: 401 };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { success: false, error: "Credenciales inválidas", status: 401 };

    const token = await generateToken({
      userId: user.id,
      businessId: user.businessId,
      role: user.role,
      plan: user.business.plan,
      name: user.name || user.email.split("@")[0],
    });

    return { success: true, token, user: { name: user.name, email: user.email, role: user.role } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message || "Datos inválidos", status: 400 };
    }
    throw err;
  }
}

export async function register(input: z.infer<typeof registerSchema>) {
  const data = registerSchema.parse(input);

  const existing = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) return { error: "El correo ya está registrado" } as const;

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const business = await db.business.create({
    data: {
      name: data.businessName,
      plan: data.plan as "BASIC" | "PREMIUM",
      users: {
        create: {
          name: data.name,
          email: data.email.toLowerCase(),
          password: hashedPassword,
          role: "SUPER_ADMIN",
        },
      },
    },
    include: { users: { take: 1 } },
  });

  return { business, user: business.users[0] } as const;
}

export async function verifyToken(token: string) {
  try {
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
