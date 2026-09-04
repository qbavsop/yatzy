const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Extract the dice path 'd' attribute from index.html (single source of truth for the logo)
const html = fs.readFileSync(path.join(ROOT, 'dice-game-app/index.html'), 'utf8');
const match = html.match(/viewBox="0 0 256 256"[^>]*>\s*<path fill-rule="evenodd" clip-rule="evenodd" d="([^"]+)"/);
if (!match) throw new Error('Could not find dice path in index.html');
const dicePath = match[1];

const NAVY = '#1D293D';
const ORANGE = '#FF8102';

function diceSvg(fill) {
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${dicePath}" fill="${fill}"/>
  </svg>`;
}

async function main() {
  // Rasterize the dice shape alone at high res, then trim to its actual ink bounding box
  // (the 256x256 viewBox has built-in padding around the shape itself).
  const raw = await sharp(Buffer.from(diceSvg(ORANGE)), { density: 2400 })
    .resize(2048, 2048)
    .png()
    .toBuffer();
  const trimmed = await sharp(raw).trim().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();

  const CANVAS = 1024;
  // Safe-zone margin is baked directly into the artwork (no XML <inset> on the foreground) -
  // some OEM launchers (BBK/ColorOS family: Oppo/OnePlus/Realme) failed to render the adaptive
  // icon at all when the foreground used <inset>, falling back to the system default icon, even
  // though the packaged resources were verified byte-correct. 0.62 keeps the same visual result
  // roughly matching a 16.7% XML inset would have produced, safely inside the round-icon mask.
  const FILL_RATIO = 0.62;
  const longerSide = Math.max(trimmedMeta.width, trimmedMeta.height);
  const targetSize = Math.round(CANVAS * FILL_RATIO);
  const scale = targetSize / longerSide;
  const diceW = Math.round(trimmedMeta.width * scale);
  const diceH = Math.round(trimmedMeta.height * scale);
  const diceResized = await sharp(trimmed).resize(diceW, diceH).toBuffer();
  const left = Math.round((CANVAS - diceW) / 2);
  const top = Math.round((CANVAS - diceH) / 2);

  // icon.png: flattened navy + dice (legacy launcher icon / Play Store listing icon)
  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 3, background: NAVY }
  })
    .composite([{ input: diceResized, left, top }])
    .png()
    .toFile(path.join(ROOT, 'resources/icon.png'));

  // icon-foreground.png: transparent + dice (adaptive icon foreground layer)
  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: diceResized, left, top }])
    .png()
    .toFile(path.join(ROOT, 'resources/icon-foreground.png'));

  // icon-background.png: flat navy (adaptive icon background layer) - unchanged content, regenerated for consistency
  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 3, background: NAVY }
  })
    .png()
    .toFile(path.join(ROOT, 'resources/icon-background.png'));

  // icon-512.png: Play Store listing icon size
  await sharp(path.join(ROOT, 'resources/icon.png'))
    .resize(512, 512)
    .png()
    .toFile(path.join(ROOT, 'resources/icon-512.png'));

  // Regenerate every Android mipmap density from the new 1024px sources, matching existing file sizes exactly
  const densities = {
    ldpi: 36, mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192
  };
  const mipmapRoot = path.join(ROOT, 'android/app/src/main/res');

  for (const [density, size] of Object.entries(densities)) {
    const dir = path.join(mipmapRoot, `mipmap-${density}`);

    // ic_launcher.png (legacy square)
    await sharp(path.join(ROOT, 'resources/icon.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // ic_launcher_round.png (legacy round - dice on a navy circle, transparent corners)
    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
    );
    await sharp(path.join(ROOT, 'resources/icon.png')).resize(size, size)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // ic_launcher_foreground.png / ic_launcher_background.png (adaptive icon layers)
    await sharp(path.join(ROOT, 'resources/icon-foreground.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    await sharp(path.join(ROOT, 'resources/icon-background.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher_background.png'));
  }

  console.log('Done. Trimmed dice:', trimmedMeta.width + 'x' + trimmedMeta.height, '-> placed at', diceW + 'x' + diceH, 'on', CANVAS + 'x' + CANVAS);
}

main().catch(e => { console.error(e); process.exit(1); });
