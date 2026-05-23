"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollReveal3dProps = {
  children: ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  distance?: number;
  rotateX?: number;
};

export function ScrollReveal3d({
  children,
  className = "",
  from = "up",
  delay = 0,
  distance = 50,
  rotateX = 8,
}: ScrollReveal3dProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vars: Record<string, unknown> = {
      opacity: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      transformOrigin: "center bottom",
    };

    if (from === "up") {
      vars.y = distance;
      vars.rotationX = rotateX;
    } else if (from === "down") {
      vars.y = -distance;
      vars.rotationX = -rotateX;
    } else if (from === "left") {
      vars.x = distance;
      vars.rotationY = rotateX;
    } else if (from === "right") {
      vars.x = -distance;
      vars.rotationY = -rotateX;
    } else if (from === "scale") {
      vars.scale = 0.85;
      vars.opacity = 0;
    }

    gsap.fromTo(el, vars, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el || t.vars.trigger === el) t.kill();
      });
    };
  }, [from, delay, distance, rotateX]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
