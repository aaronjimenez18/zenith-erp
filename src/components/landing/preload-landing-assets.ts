import { getLaptopFrameSrc, LAPTOP_ANIMATION } from "./laptop-animation-config";

const PRELOAD_BATCH = 32;

let framesCache: (HTMLImageElement | undefined)[] | null = null;
let preloadPromise: Promise<(HTMLImageElement | undefined)[]> | null = null;

const EXTRA_IMAGES = ["/landing/ia/ia-captura.webp"] as const;

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = async () => {
      try {
        await img.decode();
      } catch {
        /* ok */
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}

async function preloadLaptopFrames(
  onFrameProgress: (percent: number) => void,
): Promise<(HTMLImageElement | undefined)[]> {
  const { frameCount } = LAPTOP_ANIMATION;
  const frames: (HTMLImageElement | undefined)[] = new Array(frameCount + 1);
  let loaded = 0;

  const markLoaded = () => {
    loaded += 1;
    onFrameProgress(Math.round((loaded / frameCount) * 100));
  };

  const loadFrame = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try {
          await img.decode();
        } catch {
          /* ok */
        }
        frames[i] = img;
        markLoaded();
        resolve();
      };
      img.onerror = () => {
        markLoaded();
        resolve();
      };
      img.src = getLaptopFrameSrc(i);
    });

  const priority = [1, frameCount, 2, 3, frameCount - 1];
  const rest = Array.from({ length: frameCount }, (_, i) => i + 1).filter(
    (i) => !priority.includes(i),
  );

  await Promise.all(priority.map((i) => loadFrame(i)));
  for (let start = 0; start < rest.length; start += PRELOAD_BATCH) {
    const slice = rest.slice(start, start + PRELOAD_BATCH);
    await Promise.all(slice.map((i) => loadFrame(i)));
  }

  return frames;
}

export function getLaptopFramesCache(): (HTMLImageElement | undefined)[] | null {
  return framesCache;
}

export async function preloadLandingAssets(
  onProgress?: (percent: number) => void,
): Promise<void> {
  if (framesCache) {
    onProgress?.(100);
    return;
  }

  if (preloadPromise) {
    await preloadPromise;
    onProgress?.(100);
    return;
  }

  preloadPromise = (async () => {
    let framePct = 0;
    let extrasDone = 0;

    const report = () => {
      const extrasPct = (extrasDone / 3) * 15;
      const combined = Math.min(100, Math.round(framePct * 0.85 + extrasPct));
      onProgress?.(combined);
    };

    const framesTask = preloadLaptopFrames((pct) => {
      framePct = pct;
      report();
    });

    const fontsTask = document.fonts.ready.then(() => {
      extrasDone += 1;
      report();
    });

    const windowTask = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        extrasDone += 1;
        report();
        resolve();
        return;
      }
      window.addEventListener(
        "load",
        () => {
          extrasDone += 1;
          report();
          resolve();
        },
        { once: true },
      );
    });

    const imagesTask = Promise.all(EXTRA_IMAGES.map(loadImage)).then(() => {
      extrasDone += 1;
      report();
    });

    const [frames] = await Promise.all([
      framesTask,
      fontsTask,
      windowTask,
      imagesTask,
    ]);

    framesCache = frames;
    onProgress?.(100);
    return frames;
  })();

  await preloadPromise;
}
