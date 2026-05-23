"use client";

import { useEffect, useState } from "react";
import type { LandingAssetsState } from "./landing-assets-context";
import {
  getLaptopFramesCache,
  preloadLandingAssets,
} from "./preload-landing-assets";

export function useLandingPreload(): LandingAssetsState {
  const [state, setState] = useState<LandingAssetsState>({
    ready: false,
    percent: 0,
    frames: null,
  });

  useEffect(() => {
    let cancelled = false;

    preloadLandingAssets((p) => {
      if (!cancelled) setState((s) => ({ ...s, percent: p }));
    }).then(() => {
      if (!cancelled) {
        setState({
          ready: true,
          percent: 100,
          frames: getLaptopFramesCache(),
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
