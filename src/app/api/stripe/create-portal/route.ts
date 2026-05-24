import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const business = await db.business.findUnique({
      where: { id: user.businessId },
    });
    if (!business?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Sin cliente Stripe" },
        { status: 400 },
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: business.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/suscripcion`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal:", error);
    return NextResponse.json(
      { error: "Error al crear portal" },
      { status: 500 },
    );
  }
}
