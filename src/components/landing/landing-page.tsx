import dynamic from "next/dynamic";
import { LandingScrollProvider } from "./landing-scroll-provider";
import { LandingShell } from "./landing-shell";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingFooter } from "./landing-footer";

const LandingModules = dynamic(() => import("./landing-modules").then((m) => m.LandingModules));
const LandingAi = dynamic(() => import("./landing-ai").then((m) => m.LandingAi));
const LandingRoles = dynamic(() => import("./landing-roles").then((m) => m.LandingRoles));
const LandingPricing = dynamic(() => import("./landing-pricing").then((m) => m.LandingPricing));

export function LandingPage() {
  return (
    <LandingScrollProvider>
      <LandingShell>
        <div className="min-h-screen bg-[#faf9f5] text-[#1b1c1a] antialiased selection:bg-[#134235]/20">
          <LandingHeader />
          <main>
            <LandingHero />
            <LandingModules />
            <LandingAi />
            <LandingRoles />
            <LandingPricing />
          </main>
          <LandingFooter />
        </div>
      </LandingShell>
    </LandingScrollProvider>
  );
}
