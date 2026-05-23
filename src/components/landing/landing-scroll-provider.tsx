"use client";

import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingScrollContext } from "./landing-scroll-context";

gsap.registerPlugin(ScrollTrigger);

export function LandingScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  const setScrollLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    } else {
      lenis.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenis.stop();

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <LandingScrollContext.Provider value={{ setScrollLocked }}>
      {children}
    </LandingScrollContext.Provider>
  );
}
