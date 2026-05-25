"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  distance?: number;
  scrub?: boolean;
};

export function ScrollReveal({
  children,
  className = "",
  from = "up",
  delay = 0,
  distance = 48,
  scrub = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ease: "power4.out",
    };
    if (from === "up") fromVars.y = distance;
    else if (from === "down") fromVars.y = -distance;
    else if (from === "left") fromVars.x = distance;
    else if (from === "right") fromVars.x = -distance;
    else if (from === "scale") { fromVars.scale = 0.92; fromVars.opacity = 0; }

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 35%",
        scrub: scrub ? 1.5 : false,
        toggleActions: scrub ? undefined : "play none none none",
      },
    };
    if (!scrub) {
      toVars.duration = 0.9;
      toVars.delay = delay;
    }

    gsap.fromTo(el, fromVars, toVars);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el || t.vars.trigger === el) t.kill();
      });
    };
  }, [from, delay, distance, scrub]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
