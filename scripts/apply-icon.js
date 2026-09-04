const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = process.argv[2];
if (!SOURCE) throw new Error('Usage: node apply-icon.js <path-to-1024x1024-png>');

async function main() {
  const CANVAS = 1024;

  // icon.png: use the flat source image as-is (legacy launcher icon / Play Store listing icon)
  await sharp(SOURCE).resize(CANVAS, CANVAS).png()
    .toFile(path.join(ROOT, 'resources/icon.png'));

  // Adaptive icon: this source has no foreground/background separation (it's a flat render,
  // not a silhouette-on-transparent asset), so put the whole image on the background layer
  // (no inset in the XML, confirmed full-bleed) and leave foreground empty/transparent.
  await sharp(SOURCE).resize(CANVAS, CANVAS).png()
    .toFile(path.join(ROOT, 'resources/icon-background.png'));

  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).png().toFile(path.join(ROOT, 'resources/icon-foreground.png'));

  // icon-512.png: Play Store listing icon size
  await sharp(path.join(ROOT, 'resources/icon.png')).resize(512, 512).png()
    .toFile(path.join(ROOT, 'resources/icon-512.png'));

  const densities = { ldpi: 36, mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  const mipmapRoot = path.join(ROOT, 'android/app/src/main/res');

  for (const [density, size] of Object.entries(densities)) {
    const dir = path.join(mipmapRoot, `mipmap-${density}`);

    await sharp(path.join(ROOT, 'resources/icon.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
    );
    await sharp(path.join(ROOT, 'resources/icon.png')).resize(size, size)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    await sharp(path.join(ROOT, 'resources/icon-foreground.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    await sharp(path.join(ROOT, 'resources/icon-background.png')).resize(size, size).png()
      .toFile(path.join(dir, 'ic_launcher_background.png'));
  }

  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
