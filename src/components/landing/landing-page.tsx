import { LandingScrollProvider } from "./landing-scroll-provider";
import { LandingShell } from "./landing-shell";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingAi } from "./landing-ai";
import { LandingModules } from "./landing-modules";
import { LandingRoles } from "./landing-roles";
import { LandingPricing } from "./landing-pricing";
import { LandingFooter } from "./landing-footer";

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
