"use client";

import Link from "next/link";
import { LaptopImage } from "./laptop-image";

export function LandingHero() {
  return (
    <section className="relative min-h-svh overflow-hidden bg-[#faf9f5]">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#134235]/10 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[#2d5a4c]/8 blur-[100px] animate-pulse [animation-delay:2s]" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3f0] via-[#faf9f5] to-[#faf9f5]" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col items-center justify-center px-6 py-20 lg:flex-row lg:gap-20 lg:py-0">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#1b1c1a]">
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
              className="group relative rounded-full bg-[#134235] px-10 py-4 text-sm font-semibold text-white shadow-xl shadow-[#134235]/20 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#134235]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2"
            >
              <span className="relative z-10">Empieza Gratis</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2d5a4c] to-[#134235] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
            <Link
              href="/login"
              className="glass-card rounded-full border border-[#c0c8c3]/60 bg-white/70 px-10 py-4 text-sm font-medium text-[#404945] backdrop-blur-xl transition-all duration-300 hover:border-[#134235]/30 hover:bg-white/90 hover:text-[#134235] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2"
            >
              Ver Demo
            </Link>
          </div>
        </div>
        <div className="mt-16 flex-1 lg:mt-0">
          <LaptopImage />
        </div>
      </div>
    </section>
  );
}
