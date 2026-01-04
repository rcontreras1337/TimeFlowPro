/**
 * TimeFlowPro - Icon Generation Script
 *
 * Generates PNG icons from SVG sources for PWA and favicon support.
 * Requires: sharp
 *
 * Usage: node scripts/generate-icons.js
 *
 * @see apps/web/BRAND-ASSETS.md
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('❌ Sharp not installed. Run: pnpm add -D sharp');
  console.log('\n📋 Alternative: Use online tools or Inkscape CLI');
  console.log('   See: apps/web/BRAND-ASSETS.md for instructions\n');
  process.exit(1);
}

const PUBLIC_DIR = path.join(__dirname, '..', 'apps', 'web', 'public');

/** Icon configurations */
const ICONS = [
  {
    input: 'favicon.svg',
    output: 'favicon.png',
    size: 32,
  },
  {
    input: 'apple-touch-icon.svg',
    output: 'apple-touch-icon.png',
    size: 180,
  },
  {
    input: 'logo-icon.svg',
    output: 'icon-192.png',
    size: 192,
  },
  {
    input: 'logo-icon.svg',
    output: 'icon-512.png',
    size: 512,
  },
  {
    input: 'og-image.svg',
    output: 'og-image.png',
    size: { width: 1200, height: 630 },
  },
];

/**
 * Generate PNG from SVG
 */
async function generateIcon(config) {
  const inputPath = path.join(PUBLIC_DIR, config.input);
  const outputPath = path.join(PUBLIC_DIR, config.output);

  // Check if input exists
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} (not found)`);
    return false;
  }

  try {
    const size =
      typeof config.size === 'number'
        ? { width: config.size, height: config.size }
        : config.size;

    await sharp(inputPath)
      .resize(size.width, size.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated ${config.output} (${size.width}x${size.height})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate ${config.output}:`, error.message);
    return false;
  }
}

/**
 * Generate favicon.ico from PNG
 */
async function generateFaviconIco() {
  const pngPath = path.join(PUBLIC_DIR, 'favicon.png');
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');

  if (!fs.existsSync(pngPath)) {
    console.log('⚠️  Skipping favicon.ico (favicon.png not found)');
    return false;
  }

  try {
    // For ICO, we just copy the 32x32 PNG as a simple solution
    // For proper ICO with multiple sizes, use a dedicated library
    const pngBuffer = await sharp(pngPath).png().toBuffer();

    // Simple approach: use PNG directly (modern browsers support this)
    fs.copyFileSync(pngPath, icoPath.replace('.ico', '-fallback.png'));

    console.log('ℹ️  favicon.ico: Use online converter or ico-generator npm package');
    console.log('   Browsers support favicon.svg directly (recommended)');
    return true;
  } catch (error) {
    console.error('❌ Failed to process favicon:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🎨 TimeFlowPro - Generating Icons\n');
  console.log(`📁 Output directory: ${PUBLIC_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (const config of ICONS) {
    const result = await generateIcon(config);
    if (result) success++;
    else failed++;
  }

  await generateFaviconIco();

  console.log('\n---');
  console.log(`✅ Generated: ${success}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
  }
  console.log('\n💡 Tip: Add generated PNGs to git\n');
}

main().catch(console.error);

