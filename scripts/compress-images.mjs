import sharp from "sharp";
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node compress-images.mjs <dir>");
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;
let changed = 0;

const files = readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));

for (const file of files) {
  const full = join(dir, file);
  const before = statSync(full).size;
  const input = readFileSync(full);
  const output = await sharp(input).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  totalBefore += before;
  if (output.length < before) {
    writeFileSync(full, output);
    totalAfter += output.length;
    changed++;
  } else {
    totalAfter += before;
  }
}

console.log(`Processed ${files.length} files, compressed ${changed}`);
console.log(`Before: ${(totalBefore / 1024).toFixed(1)} KB`);
console.log(`After:  ${(totalAfter / 1024).toFixed(1)} KB`);
console.log(`Saved:  ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`);
