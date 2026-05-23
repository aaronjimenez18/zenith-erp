export async function preloadImages(
  urls: string[],
  options?: {
    concurrency?: number;
    onProgress?: (loaded: number, total: number) => void;
  },
): Promise<void> {
  const concurrency = options?.concurrency ?? 12;
  const total = urls.length;
  let loaded = 0;
  let index = 0;

  const loadOne = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        loaded += 1;
        options?.onProgress?.(loaded, total);
        resolve();
      };
      img.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
      img.src = src;
    });

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      await loadOne(urls[i]);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, urls.length) },
    () => worker(),
  );
  await Promise.all(workers);
}
