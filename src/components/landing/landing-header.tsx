"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 md:px-6">
      <div
        className={`w-full transition-all duration-500 ${
          scrolled
            ? "mt-3 rounded-2xl border border-white/70 bg-white/80 px-4 shadow-[0_8px_32px_rgba(19,66,53,0.12)] shadow-black/5 backdrop-blur-2xl md:max-w-xs md:rounded-full md:px-3"
            : "mt-0 rounded-none bg-transparent"
        }`}
      >
        <div
          className={`flex h-12 items-center md:h-14 ${
            scrolled ? "justify-center gap-4" : "justify-between"
          }`}
        >
          <Link
            href="/"
            className={`font-display font-semibold tracking-tight text-[#134235] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2 ${
              scrolled ? "hidden" : "text-xl"
            }`}
          >
            ERP Zenith
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="whitespace-nowrap text-sm font-medium text-[#404945] transition-colors hover:text-[#134235] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="whitespace-nowrap rounded-full bg-[#134235] px-4 py-2 text-xs font-bold tracking-wider text-white transition-all hover:bg-[#2d5a4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#134235] focus-visible:ring-offset-2"
            >
              Prueba gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
