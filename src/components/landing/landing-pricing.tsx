"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS } from "./constants";
import { ScrollReveal } from "./scroll-reveal";

export function LandingPricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="precios" className="bg-[#f5f4f0] px-4 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal from="up" distance={32}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a4c]">
              Inversión inteligente
            </p>
            <h2 className="font-display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1b1c1a]">
              Una inversión que
              <br />
              <span className="text-gradient-organic">se paga sola</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[#404945]">
              Todos los planes incluyen productos ilimitados, POS y dashboard.
              Escala cuando lo necesites.
            </p>
          </div>
        </ScrollReveal>

        {/* Toggle Mensual / Anual */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="relative flex items-center rounded-full border border-[#e3e2df] bg-white p-1 shadow-sm">
            <div
              className={`absolute left-1 top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-[#134235] shadow-sm transition-transform duration-300 ease-out ${
                annual ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2 ${
                !annual ? "text-white" : "text-[#717975] hover:text-[#1b1c1a]"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2 ${
                annual ? "text-white" : "text-[#717975] hover:text-[#1b1c1a]"
              }`}
            >
              Anual
            </button>
          </div>
          {annual && (
            <span className="text-xs font-semibold text-[#2d5a4c]">
              Ahorra hasta 2 meses
            </span>
          )}
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.id} from="up" delay={i * 0.08} distance={32} scrub>
              <article
                className={`group relative flex cursor-pointer flex-col rounded-[20px] p-6 transition-all duration-500 md:p-8 ${
                  plan.highlighted
                    ? "border-2 border-[#134235] bg-[#134235] text-white shadow-xl"
                    : "border border-white/50 bg-white/60 text-[#1b1c1a] shadow-lg shadow-black/[0.02] backdrop-blur-2xl hover:-translate-y-1 hover:border-[#134235]/20 hover:bg-white/90 hover:shadow-xl"
                }`}
              >
                {"badge" in plan && plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#a0cfbe] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[#134235] shadow-lg">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold tracking-[-0.01em]">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  {plan.monthlyPrice ? (
                    annual ? (
                      <>
                        <span className="text-4xl font-bold tabular-nums tracking-[-0.02em]">
                          ${plan.annualPrice}
                        </span>
                        <span className={plan.highlighted ? "text-white/60" : "text-[#717975]"}>
                          /año
                        </span>
                        <div className={`mt-1 text-xs font-medium ${plan.highlighted ? "text-white/70" : "text-[#2d5a4c]"}`}>
                          ${plan.monthlyPrice}/mes al pagar anual
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold tabular-nums tracking-[-0.02em]">
                          ${plan.monthlyPrice}
                        </span>
                        <span className={plan.highlighted ? "text-white/60" : "text-[#717975]"}>
                          /mes
                        </span>
                      </>
                    )
                  ) : (
                    <span className="text-3xl font-bold">Personalizado</span>
                  )}
                </div>
                <p className={`mb-6 text-sm font-medium ${plan.highlighted ? "text-white/80" : "text-[#404945]"}`}>
                  {plan.description}
                </p>
                <ul className="mb-8 flex-1 space-y-3 text-left text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${plan.highlighted ? "text-[#a0cfbe]" : "text-[#2d5a4c]"}`}
                      />
                      <span className={`font-medium ${plan.highlighted ? "text-white/90" : "text-[#404945]"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                {"contact" in plan && plan.contact ? (
                  <a
                    href="mailto:soporte@zenitherp.com"
                    className="block rounded-full border border-[#134235] py-3 text-center text-sm font-medium text-[#134235] backdrop-blur-xl transition-all hover:bg-[#134235]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={`/register?plan=${plan.id}&interval=${annual ? "annual" : "month"}`}
                    className={`block rounded-full py-3 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2 ${
                      plan.highlighted
                        ? "bg-white text-[#134235] hover:shadow-xl"
                        : "bg-[#134235]/90 text-white backdrop-blur-xl hover:bg-[#134235] hover:shadow-xl"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
