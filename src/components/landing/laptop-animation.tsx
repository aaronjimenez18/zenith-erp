"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  frameProgressToIndex,
  scrollProgressToFrameProgress,
} from "./laptop-animation-config";
import { useLandingAssets } from "./landing-assets-context";

gsap.registerPlugin(ScrollTrigger);

type LaptopAnimationProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  onProgress?: (progress: number) => void;
};

export function LaptopAnimation({ trackRef, onProgress }: LaptopAnimationProps) {
  const { frames } = useLandingAssets();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const displayedFrameRef = useRef(0);
  const dprRef = useRef(1);
  const [canvasReady, setCanvasReady] = useState(false);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (index > 0) {
      const img = framesRef.current[index];
      if (!img?.complete || !img.naturalWidth) return false;
      ctx.drawImage(img, 0, 0, w, h);
    }

    displayedFrameRef.current = index;
    setCanvasReady(true);
    return true;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = framesRef.current[1];
    if (!canvas || !img?.naturalWidth) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const parentW = containerRef.current?.clientWidth ?? window.innerWidth;
    const maxW = Math.max(280, Math.min(parentW - 32, 896));
    const aspect = img.naturalHeight / img.naturalWidth;
    const cssW = maxW;

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssW * aspect}px`;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssW * aspect * dpr);

    return drawFrame(displayedFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    if (!frames?.[1]) return;

    framesRef.current = frames;
    displayedFrameRef.current = 0;
    setCanvasReady(false);

    let trigger: ScrollTrigger | undefined;
    let rafId = 0;

    const setup = () => {
      const track = trackRef.current;
      if (!track || !framesRef.current[1]?.naturalWidth) {
        rafId = requestAnimationFrame(setup);
        return;
      }

      resizeCanvas();
      drawFrame(0);

      trigger?.kill();
      trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const scrollP = self.progress;
          onProgressRef.current?.(scrollP);

          const frameP = scrollProgressToFrameProgress(scrollP);
          const index = frameProgressToIndex(frameP);
          if (index !== displayedFrameRef.current) {
            drawFrame(index);
          }
        },
      });

      ScrollTrigger.refresh();
    };

    rafId = requestAnimationFrame(setup);

    const onResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      trigger?.kill();
    };
  }, [frames, trackRef, resizeCanvas, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-4xl items-center justify-center px-4"
      style={{ filter: "drop-shadow(0 30px 80px rgba(19,66,53,0.18))" }}
    >
      <canvas
        ref={canvasRef}
        className="mx-auto max-w-full select-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: canvasReady ? 1 : 0 }}
        aria-label="Laptop Zenith ERP"
      />
    </div>
  );
}
