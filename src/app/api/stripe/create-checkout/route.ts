import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreatePriceIds } from "@/lib/stripe-products";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { plan, interval } = await req.json();
    if (!plan || !interval) {
      return NextResponse.json(
        { error: "Faltan campos: plan, interval" },
        { status: 400 },
      );
    }

    const business = await db.business.findUnique({
      where: { id: user.businessId },
    });
    if (!business) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 },
      );
    }

    const prices = await getOrCreatePriceIds();
    const priceId =
      interval === "annual"
        ? prices[plan]?.annual
        : prices[plan]?.monthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Plan no válido" },
        { status: 400 },
      );
    }

    let customerId = business.stripeCustomerId;

    if (!customerId) {
      const owner = await db.user.findFirst({
        where: { businessId: business.id, role: "SUPER_ADMIN" },
      });
      const customer = await stripe.customers.create({
        email: owner?.email ?? undefined,
        name: user.name,
        metadata: { businessId: business.id },
      });
      customerId = customer.id;
      await db.business.update({
        where: { id: business.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { businessId: business.id, plan },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/suscripcion?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/suscripcion?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Error al crear checkout" },
      { status: 500 },
    );
  }
}
