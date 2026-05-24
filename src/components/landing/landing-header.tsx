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
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 md:px-6">
      <div
        className={`w-full transition-all duration-500 ${
          scrolled
            ? "mt-3 max-w-xs rounded-full border border-white/60 bg-white/70 px-3 shadow-[0_8px_32px_rgba(19,66,53,0.1)] backdrop-blur-2xl"
            : "mt-0 max-w-none rounded-none bg-transparent px-5 md:px-8"
        }`}
      >
        <div
          className={`flex h-12 items-center md:h-14 ${
            scrolled ? "justify-center gap-4" : "justify-between"
          }`}
        >
          <Link
            href="/"
            className={`font-display font-semibold tracking-tight text-[#134235] transition-all duration-300 ${
              scrolled ? "hidden" : "text-xl"
            }`}
          >
            ERP Zenith
          </Link>

          <nav className={`hidden items-center gap-8 md:flex ${scrolled ? "md:hidden" : ""}`}>
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

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className={`font-medium text-[#404945] transition-colors hover:text-[#134235] ${
                scrolled ? "text-sm" : "text-sm"
              }`}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className={`rounded-full bg-[#134235] font-bold tracking-wider text-white transition-all hover:bg-[#2d5a4c] ${
                scrolled
                  ? "px-4 py-2 text-xs"
                  : "px-5 py-2.5 text-xs"
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
          <div className="overflow-hidden border-t border-[#e3e2df]/60 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#404945] transition-colors hover:bg-white/60 hover:text-[#134235]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-1 border-[#e3e2df]/40" />
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#404945] transition-colors hover:bg-white/60 hover:text-[#134235]"
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="mx-3 mt-2 rounded-full bg-[#134235] px-4 py-2.5 text-center text-sm font-bold tracking-wider text-white transition-all hover:bg-[#2d5a4c]"
                onClick={() => setOpen(false)}
              >
                Prueba gratis
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
