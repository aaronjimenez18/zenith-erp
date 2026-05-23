import { ROLES } from "./constants";
import { ScrollReveal } from "./scroll-reveal";

export function LandingRoles() {
  return (
    <section id="roles" className="bg-white px-4 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal from="up" distance={32}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#2d5a4c]">
              Estructura y control
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1b1c1a]">
              El control en las
              <br />
              <span className="text-gradient-organic">manos correctas</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[#404945]">
              Jerarquías claras para que cada miembro de tu equipo tenga acceso
              exacto a lo que necesita.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            return (
              <ScrollReveal key={role.name} from="up" delay={i * 0.12} distance={24} scrub>
                <div className="group text-center">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-[#c0c8c3] bg-white transition-all duration-500 group-hover:scale-110 group-hover:border-[#134235]/30 group-hover:shadow-lg">
                    <Icon className="size-8 text-[#134235]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.1em] text-[#56615b]">
                    {role.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#404945]">
                    {role.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
