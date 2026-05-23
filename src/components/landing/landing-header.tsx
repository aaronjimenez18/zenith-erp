"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./constants";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#e3e2df]/60 bg-[#faf9f5]/80 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "h-14 shadow-3d-sm" : "h-16"
      }`}
    >
      <div
        className={`mx-auto flex h-full max-w-6xl items-center justify-between px-4 transition-all duration-300 md:px-10 ${
          scrolled ? "gap-4" : "gap-8"
        }`}
      >
        <Link
          href="/"
          className={`font-display font-semibold tracking-tight text-[#134235] transition-all duration-300 ${
            scrolled ? "text-lg" : "text-xl"
          }`}
        >
          ERP Zenith
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#404945] transition-colors hover:text-[#134235]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#404945] transition-colors hover:text-[#134235]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className={`rounded-full bg-[#134235] text-xs font-bold tracking-wider text-white transition-all hover:bg-[#2d5a4c] ${
              scrolled ? "px-4 py-2" : "px-5 py-2.5"
            }`}
          >
            Prueba gratis
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#404945] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e3e2df] bg-[#faf9f5] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#404945]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
