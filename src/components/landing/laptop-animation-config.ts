export const LAPTOP_ANIMATION = {
  basePath: "/landing/frames-webp",
  frameCount: 211,
  /** Scroll dedicado a que desaparezca el copy del hero (~1 rueda) */
  introScrollVh: 18,
  /** Scroll para la secuencia de apertura de la laptop */
  scrollVh: 220,
} as const;

export function getIntroScrollRatio(): number {
  const { introScrollVh, scrollVh } = LAPTOP_ANIMATION;
  return introScrollVh / (introScrollVh + scrollVh);
}

export function getTrackHeightVh(): number {
  const { introScrollVh, scrollVh } = LAPTOP_ANIMATION;
  return 100 + introScrollVh + scrollVh;
}

export function getLaptopFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `${LAPTOP_ANIMATION.basePath}/ezgif-frame-${padded}.webp`;
}

export function scrollProgressToFrameProgress(scrollProgress: number): number {
  const intro = getIntroScrollRatio();
  if (scrollProgress <= intro) return -1;
  return Math.min(1, (scrollProgress - intro) / (1 - intro));
}

export function frameProgressToIndex(frameProgress: number): number {
  const { frameCount } = LAPTOP_ANIMATION;
  if (frameProgress >= 1) return frameCount;
  if (frameProgress < 0) return 0;
  if (frameProgress === 0) return 1;
  return Math.max(1, Math.floor(frameProgress * frameCount) + 1);
}
