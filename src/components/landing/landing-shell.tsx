"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingAssetsContext } from "./landing-assets-context";
import { LandingPageLoader } from "./landing-page-loader";
import { useLandingScroll } from "./landing-scroll-context";
import { useLandingPreload } from "./use-landing-preload";

type LandingShellProps = {
  children: ReactNode;
};

export function LandingShell({ children }: LandingShellProps) {
  const assets = useLandingPreload();
  const { setScrollLocked } = useLandingScroll();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setScrollLocked(!assets.ready);
  }, [assets.ready, setScrollLocked]);

  useEffect(() => {
    if (!assets.ready) return;
    setExiting(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = window.setTimeout(() => setLoaderVisible(false), 480);
    return () => window.clearTimeout(timer);
  }, [assets.ready]);

  return (
    <LandingAssetsContext.Provider value={assets}>
      {loaderVisible && (
        <LandingPageLoader percent={assets.percent} exiting={exiting} />
      )}
      {assets.ready ? (
        <div className="landing-content landing-content--visible">{children}</div>
      ) : null}
    </LandingAssetsContext.Provider>
  );
}
