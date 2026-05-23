import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AI_FEATURES } from "./constants";
import { ScrollReveal } from "./scroll-reveal";

export function LandingAi() {
  return (
    <section id="ia" className="bg-[#f5f4f0] px-4 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal from="left" distance={48}>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c0c8c3]/50 bg-white/80 px-4 py-1.5 backdrop-blur-xl">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a4c]">
                  Inteligencia artificial
                </span>
              </div>
              <h2 className="mt-6 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1b1c1a]">
                Tu socio estratégico
                <br />
                <span className="text-gradient-organic">disponible 24/7</span>
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-[#404945]">
                Un asistente que conoce cada rincón de tu negocio. Analiza ventas,
                predice stock, y responde cualquier consulta en lenguaje natural.
              </p>
              <ul className="mt-8 space-y-4">
                {AI_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d7e2db] text-[#134235]">
                     
                    </span>
                    <span className="text-sm font-medium text-[#404945] md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register?plan=PREMIUM"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#c0c8c3]/60 bg-white/70 px-7 py-3 text-sm font-medium text-[#404945] backdrop-blur-xl transition-all duration-300 hover:border-[#134235]/30 hover:bg-white/90 hover:text-[#134235] hover:shadow-xl"
              >
                <span>Conocer más</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal from="right" distance={48} scrub>
            <Image
              src="/landing/ia/ia-captura.webp"
              alt="Captura de conversación con el asistente IA de Zenith"
              width={1183}
              height={876}
              className="h-auto w-full rounded-[20px] shadow-xl"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
