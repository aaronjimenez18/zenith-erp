"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "modulos", label: "Módulos" },
  { id: "ia", label: "Asistente IA" },
  { id: "roles", label: "Roles" },
  { id: "precios", label: "Precios" },
];

export function ScrollSpyNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#717975] [writing-mode:vertical-rl]">
        Secciones
      </span>
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-center"
            aria-label={section.label}
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                isActive
                  ? "size-3 bg-[#134235] shadow-[0_0_12px_rgba(19,66,53,0.3)]"
                  : "size-2 bg-[#c0c8c3] hover:bg-[#717975]"
              }`}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-[#404945] opacity-0 transition-all duration-300 group-hover:opacity-100">
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
