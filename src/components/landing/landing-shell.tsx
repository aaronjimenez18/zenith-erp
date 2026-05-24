"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LandingShellProps = {
  children: React.ReactNode;
};

export function LandingShell({ children }: LandingShellProps) {
  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="landing-content landing-content--visible">
      {children}
    </div>
  );
}
