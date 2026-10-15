import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
const out = "public/images";

if (!src) {
  console.log("Usage: node scripts/resize-images.mjs <source-folder>");
  process.exit(1);
}

fs.mkdirSync(out, { recursive: true });

for (const f of fs.readdirSync(src)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const name = path.parse(f).name + ".jpg";
  await sharp(path.join(src, f))
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toFile(path.join(out, name));
  console.log("done:", name);
}
