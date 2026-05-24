"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { PLANS } from "@/components/landing/constants";

type BillingInfo = {
  plan: string;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  trialEnd: string | null;
  subscriptionEnd: string | null;
};

function SuscripcionContent() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setBilling(data);
    } catch {
      console.error("Error fetching billing info");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("success")) {
      fetchBilling();
      router.replace("/dashboard/suscripcion");
    }
  }, [searchParams, fetchBilling, router]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const handleCheckout = async (plan: string, interval: string) => {
    setCheckoutLoading(`${plan}-${interval}`);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating portal:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const statusLabel = (status: string | null) => {
    switch (status) {
      case "active":
      case "trialing":
        return { text: "Activa", color: "text-green-600" };
      case "past_due":
        return { text: "Vencida", color: "text-red-600" };
      case "canceled":
        return { text: "Cancelada", color: "text-gray-500" };
      default:
        return { text: "Sin suscripción", color: "text-gray-400" };
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#134235]" />
      </div>
    );
  }

  const currentPlan = billing?.plan ?? "BASIC";
  const isSubscribed =
    billing?.subscriptionStatus === "active" ||
    billing?.subscriptionStatus === "trialing";
  const isTrialing = billing?.subscriptionStatus === "trialing";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1b1c1a]">
          Suscripción
        </h1>
        <p className="mt-1 text-sm text-[#717975]">
          Gestiona tu plan y facturación
        </p>
      </div>

      {/* Plan actual */}
      <div className="rounded-2xl border border-[#e3e2df] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#717975]">Plan actual</p>
            <p className="mt-1 text-2xl font-bold text-[#1b1c1a]">
              {currentPlan === "PREMIUM" ? "Premium" : "Básico"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {isTrialing && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Período de prueba
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  isSubscribed
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isSubscribed ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <CreditCard className="size-3" />
                )}
                {statusLabel(billing?.subscriptionStatus ?? null).text}
              </span>
            </div>
          </div>

          {billing?.stripeCustomerId && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="rounded-xl border border-[#e3e2df] bg-white px-4 py-2 text-sm font-medium text-[#404945] transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Gestionar facturación"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Planes disponibles */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.filter((p) => p.id !== "ENTERPRISE").map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                isCurrent
                  ? "border-[#134235] bg-[#134235]/5"
                  : "border-[#e3e2df] bg-white hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-[#134235] px-3 py-0.5 text-[10px] font-bold tracking-wider text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-[#1b1c1a]">{plan.name}</h3>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleCheckout(plan.id, "month")}
                  disabled={isCurrent || checkoutLoading !== null}
                  className="w-full rounded-xl bg-[#134235] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2d5a4c] disabled:opacity-50"
                >
                  {checkoutLoading === `${plan.id}-month`
                    ? "Redirigiendo..."
                    : `${plan.id === "BASIC" ? "$300" : "$800"}/mes`}
                </button>
                <button
                  onClick={() => handleCheckout(plan.id, "annual")}
                  disabled={isCurrent || checkoutLoading !== null}
                  className="w-full rounded-xl border border-[#e3e2df] px-4 py-2.5 text-sm font-medium text-[#404945] transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  {checkoutLoading === `${plan.id}-annual`
                    ? "Redirigiendo..."
                    : `${plan.id === "BASIC" ? "$3,000" : "$8,000"}/año (ahorra 2 meses)`}
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-[#717975]"
                  >
                    <CheckCircle2 className="size-3.5 text-[#2d5a4c]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SuscripcionPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#134235]" />
      </div>
    }>
      <SuscripcionContent />
    </Suspense>
  );
}
