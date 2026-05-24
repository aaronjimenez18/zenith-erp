import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

function subEnd(sub: Stripe.Subscription): Date | null {
  const s = sub as unknown as { current_period_end?: number };
  return s.current_period_end
    ? new Date(s.current_period_end * 1000)
    : null;
}

function subTrialEnd(sub: Stripe.Subscription): Date | null {
  return sub.trial_end ? new Date(sub.trial_end * 1000) : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      return NextResponse.json(
        { error: "Firma inválida" },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const businessId = session.metadata?.businessId;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription as string;

        if (businessId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId,
          );
          await db.business.update({
            where: { id: businessId },
            data: {
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: subscription.status,
              plan: plan === "PREMIUM" ? "PREMIUM" : "BASIC",
              trialEnd: subTrialEnd(subscription),
              subscriptionEnd: subEnd(subscription),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const businessId = subscription.metadata?.businessId;

        if (!businessId) {
          const customerId =
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id;
          const business = await db.business.findFirst({
            where: { stripeCustomerId: customerId },
          });
          if (!business) break;
          await db.business.update({
            where: { id: business.id },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionEnd: subEnd(subscription),
            },
          });
        } else {
          await db.business.update({
            where: { id: businessId },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionEnd: subEnd(subscription),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const business = await db.business.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (business) {
          await db.business.update({
            where: { id: business.id },
            data: {
              stripeSubscriptionId: null,
              subscriptionStatus: "canceled",
              subscriptionEnd: null,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 },
    );
  }
}
