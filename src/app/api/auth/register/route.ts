import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getOrCreatePriceIds } from "@/lib/stripe-products";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, name, email, password, plan, interval } = body;

    if (!email || !password || !name || !businessName) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedPlan = plan === "PREMIUM" ? "PREMIUM" : "BASIC";

    const business = await db.business.create({
      data: {
        name: businessName,
        plan: selectedPlan,
        users: {
          create: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            emailVerified: new Date(),
          },
        },
      },
      select: { id: true },
    });

    const prices = await getOrCreatePriceIds();
    const selectedInterval = interval === "annual" ? "annual" : "monthly";
    const priceId = prices[selectedPlan]?.[selectedInterval];

    let checkoutUrl: string | null = null;

    if (priceId) {
      const customer = await stripe.customers.create({
        email: normalizedEmail,
        name,
        metadata: { businessId: business.id },
      });

      await db.business.update({
        where: { id: business.id },
        data: { stripeCustomerId: customer.id },
      });

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: 14,
          metadata: { businessId: business.id, plan: selectedPlan },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/register?canceled=true`,
      });

      checkoutUrl = session.url;
    }

    return NextResponse.json({
      success: true,
      message: "Cuenta creada. Redirigiendo a pago...",
      checkoutUrl,
    }, { status: 201 });

  } catch (error) {
    const err = error as { code?: string };
    console.error("DEBUG REGISTRO:", error);

    if (err.code === "P2002") {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}
