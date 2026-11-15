import fs from "node:fs/promises";
import sharp from "sharp";

const source = await fs.readFile("public/media/cover.svg");

await sharp(source, { density: 150 })
  .resize(1200, 630, { fit: "cover" })
  .flatten({ background: "#0a0806" })
  .png({ compressionLevel: 9, palette: true })
  .toFile("public/media/cover.png");

const { size } = await fs.stat("public/media/cover.png");
console.log(`cover.png written — ${(size / 1024).toFixed(1)} KB`);
