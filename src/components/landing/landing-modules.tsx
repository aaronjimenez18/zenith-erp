import { MODULES, type ModuleItem } from "./constants";
import { ScrollReveal } from "./scroll-reveal";

const accentStyles: Record<ModuleItem["accent"], string> = {
  mint: "bg-[#d7e2db] text-[#134235]",
  neutral: "bg-[#e3e2df] text-[#56615b]",
  rose: "bg-[#ffdad8] text-[#6d1f22]",
};

function ModuleCard({ mod, index }: { mod: ModuleItem; index: number }) {
  const Icon = mod.icon;
  return (
    <ScrollReveal from="up" delay={index * 0.08} distance={24} scrub>
      <article className="group rounded-[20px] border border-[#e3e2df] bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className={`mb-4 flex size-11 items-center justify-center rounded-[14px] ${accentStyles[mod.accent]}`}>
          <Icon className="size-5" />
        </div>
        <h3 className="text-base font-bold tracking-[-0.01em] text-[#1b1c1a]">{mod.title}</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#404945]">
          {mod.description}
        </p>
      </article>
    </ScrollReveal>
  );
}

function ModuleHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a4c]">
        Una plataforma, infinitas posibilidades
      </p>
      <h2 className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1b1c1a]">
        Cada área de tu negocio
        <br />
        <span className="text-gradient-organic">merece orden</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[#404945]">
        Datos en tiempo real, sin fricción.
      </p>
    </div>
  );
}

export function LandingModules() {
  return (
    <section id="modulos" className="px-4 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal from="up" distance={32}>
          <ModuleHeader />
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
