"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { LaptopAnimation } from "./laptop-animation";
import { getIntroScrollRatio, getTrackHeightVh } from "./laptop-animation-config";

const INTRO = getIntroScrollRatio();
const TRACK_HEIGHT_VH = getTrackHeightVh();

export function LandingHero() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const textOpacity = progress >= INTRO ? 0 : Math.max(0, 1 - progress / INTRO);
  const textY = progress * 20;
  const showText = textOpacity > 0.02;

  return (
    <section className="relative bg-[#faf9f5]">
      <div
        ref={scrollTrackRef}
        className="relative"
        style={{ height: `${TRACK_HEIGHT_VH}vh` }}
      >
        <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
          {/* Laptop — protagonista absoluta */}
          <div className="flex w-full items-center justify-center px-4 md:px-10">
            <LaptopAnimation trackRef={scrollTrackRef} onProgress={setProgress} />
          </div>

          {/* Copy — superpuesto, se desvanece al scroll */}
          {showText && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ opacity: textOpacity }}
            >
              <div
                className="pointer-events-auto mx-auto max-w-5xl text-center px-4"
                style={{ transform: `translateY(${textY}px)` }}
              >
                <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#1b1c1a]">
                  El caos tiene los
                  <br />
                  <span className="text-gradient-organic">días contados</span>
                </h1>

                <p className="mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-[#404945]">
                  Inventario, ventas, gastos e IA en un solo lugar.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
          )}
        </div>
      </div>
    </section>
  );
}
