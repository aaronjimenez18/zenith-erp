"use client";

import { createContext, useContext } from "react";

type LandingScrollContextValue = {
  setScrollLocked: (locked: boolean) => void;
};

export const LandingScrollContext = createContext<LandingScrollContextValue>({
  setScrollLocked: () => {},
});

export function useLandingScroll() {
  return useContext(LandingScrollContext);
}
