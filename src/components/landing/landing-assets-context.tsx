"use client";

import { createContext, useContext } from "react";

export type LandingAssetsState = {
  ready: boolean;
  percent: number;
  frames: (HTMLImageElement | undefined)[] | null;
};

export const LandingAssetsContext = createContext<LandingAssetsState>({
  ready: false,
  percent: 0,
  frames: null,
});

export function useLandingAssets() {
  return useContext(LandingAssetsContext);
}
