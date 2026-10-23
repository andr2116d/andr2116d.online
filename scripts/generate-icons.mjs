// Writes public/favicon.svg from the trefoil mark, then rasterizes it into the
// PNG/ICO icons referenced by the layout.
// Usage: node scripts/generate-icons.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { trefoilSvg } from "../src/shared/brand/trefoil.ts";

await writeFile(
  "public/favicon.svg",
  trefoilSvg({ background: "#0d0d11", radius: 14, size: 64 }) + "\n",
);

const source = "public/favicon.svg";
const png = (size) =>
  sharp(source, { density: 384 }).resize(size, size).png().toBuffer();

await writeFile("public/apple-touch-icon.png", await png(180));
await writeFile("public/icon-192.png", await png(192));
await writeFile("public/icon-512.png", await png(512));

// Minimal ICO container holding one 32×32 PNG image.
const image = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(image.length, 14);
header.writeUInt32LE(22, 18); // data offset
await writeFile("public/favicon.ico", Buffer.concat([header, image]));
console.log("Icons written to public/");
