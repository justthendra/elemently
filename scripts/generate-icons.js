import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Simple CRC32 for PNG chunks
function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function createIconPNG(size) {
  const width = size;
  const height = size;

  // Raw RGBA scanlines with filter byte 0 at start of each line
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(cx, cy) - 1;
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded rectangle or circle icon
      const cornerR = size * 0.22;
      const innerX = Math.max(0, Math.abs(dx) - (cx - cornerR));
      const innerY = Math.max(0, Math.abs(dy) - (cy - cornerR));
      const cornerDist = Math.sqrt(innerX * innerX + innerY * innerY);

      if (cornerDist > cornerR) {
        // Transparent outside rounded box
        raw[pxOffset] = 0;
        raw[pxOffset + 1] = 0;
        raw[pxOffset + 2] = 0;
        raw[pxOffset + 3] = 0;
        continue;
      }

      // Purple/Indigo/Violet gradient background (#6366f1 to #8b5cf6)
      const grad = (x + y) / (width + height);
      let red = Math.floor(99 + grad * (139 - 99));
      let green = Math.floor(102 + grad * (92 - 102));
      let blue = Math.floor(241 + grad * (246 - 241));
      let alpha = 255;

      // Draw stylized inspect target / 'E' symbol
      // Central crosshair & box
      const normX = x / size;
      const normY = y / size;

      // Center inspect square
      const inBoxBorder =
        (normX >= 0.28 && normX <= 0.72 && (Math.abs(normY - 0.28) < 0.08 || Math.abs(normY - 0.72) < 0.08)) ||
        (normY >= 0.28 && normY <= 0.72 && (Math.abs(normX - 0.28) < 0.08 || Math.abs(normX - 0.72) < 0.08));

      // Central dot
      const inCenterDot = Math.hypot(normX - 0.5, normY - 0.5) < 0.12;

      // Reticle tick marks
      const inTicks =
        (Math.abs(normX - 0.5) < 0.04 && (normY < 0.24 || normY > 0.76)) ||
        (Math.abs(normY - 0.5) < 0.04 && (normX < 0.24 || normX > 0.76));

      if (inBoxBorder || inCenterDot || inTicks) {
        red = 255;
        green = 255;
        blue = 255;
      }

      raw[pxOffset] = red;
      raw[pxOffset + 1] = green;
      raw[pxOffset + 2] = blue;
      raw[pxOffset + 3] = alpha;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(raw));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

export function generateAllIcons(outDir) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sizes = [16, 32, 48, 128];
  for (const s of sizes) {
    const png = createIconPNG(s);
    const dest = path.join(outDir, `icon${s}.png`);
    fs.writeFileSync(dest, png);
  }
}

if (process.argv[1]?.endsWith('generate-icons.js')) {
  generateAllIcons('./public/icons');
  console.log('Icons generated successfully in ./public/icons');
}

