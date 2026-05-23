import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "landing", "frames-animation");
const DST = path.join(__dirname, "..", "public", "landing", "frames-webp");
const BG_THRESHOLD = 35;
const CONCURRENCY = Math.max(1, os.cpus().length - 1);

function findFiles() {
  return fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith(".jpg"))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] || "0");
      const nb = parseInt(b.match(/(\d+)/)?.[1] || "0");
      return na - nb;
    });
}

async function convertOne(file) {
  const srcPath = path.join(SRC, file);
  const dstName = file.replace(".jpg", ".webp");
  const dstPath = path.join(DST, dstName);

  if (fs.existsSync(dstPath)) return "skipped";

  const { data, info } = await sharp(srcPath)
    .resize(1920, null, { fit: "inside", withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const p = i * 3;
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const dist = Math.sqrt(
      (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
    );
    let alpha = 255;
    if (dist < BG_THRESHOLD) {
      alpha = Math.round((dist / BG_THRESHOLD) * 255);
    }
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = alpha;
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ alphaQuality: 100, quality: 90 })
    .toFile(dstPath);

  return "converted";
}

async function main() {
  if (!fs.existsSync(DST)) {
    fs.mkdirSync(DST, { recursive: true });
  }

  const files = findFiles();
  const total = files.length;
  console.log(`Converting ${total} frames to WebP with alpha (concurrency: ${CONCURRENCY})`);

  let done = 0;
  let converted = 0;
  let skipped = 0;

  const start = Date.now();

  // Process in batches
  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((f) =>
        convertOne(f)
          .then((r) => {
            done++;
            if (r === "converted") converted++;
            else skipped++;
            const pct = ((done / total) * 100).toFixed(1);
            const elapsed = ((Date.now() - start) / 1000).toFixed(1);
            process.stdout.write(
              `\r[${done}/${total}] ${pct}% — ${converted} converted, ${skipped} skipped (${elapsed}s)`
            );
            return r;
          })
          .catch((err) => {
            done++;
            const pct = ((done / total) * 100).toFixed(1);
            process.stdout.write(`\r[${done}/${total}] ${pct}% — Error: ${err.message}`);
          })
      )
    );
  }

  const totalTime = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\nDone in ${totalTime}s. Converted: ${converted}, Skipped (already exist): ${skipped}`);
}

main().catch(console.error);
