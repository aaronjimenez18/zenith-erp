"use client";

import Link from "next/link";
import { LaptopImage } from "./laptop-image";

export function LandingHero() {
  return (
    <section className="relative min-h-svh bg-[#faf9f5]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3f0] via-[#faf9f5] to-[#faf9f5]" />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col items-center justify-center px-6 py-20 lg:flex-row lg:gap-20 lg:py-0">
        <div className="mt-16 flex-1 lg:mt-0">
          <LaptopImage />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#1b1c1a]">
            El caos tiene los
            <br />
            <span className="text-gradient-organic">días contados</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-[#404945] lg:mx-0">
            Inventario, ventas, gastos e IA en un solo lugar.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/register"
              className="rounded-full bg-[#134235]/90 px-10 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:bg-[#134235] hover:shadow-2xl"
            >
              Empieza Gratis
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#c0c8c3]/60 bg-white/70 px-10 py-4 text-sm font-medium text-[#404945] backdrop-blur-xl transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
