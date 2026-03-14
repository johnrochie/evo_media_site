/**
 * Capture portfolio screenshots using Playwright.
 *
 * First time:  npx playwright install chromium
 * Then run:    npm run capture:screenshots
 *
 * Output: public/portfolio-samples/*.jpg
 */

import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "portfolio-samples");

const SITES = [
  { url: "https://real-estate-agency-lemon.vercel.app/", file: "luxe-estates.jpg" },
  { url: "https://dental-practice-xi.vercel.app/", file: "premier-dental.jpg" },
  { url: "https://travelbug-v1.vercel.app/", file: "travel-bug.jpg" },
  { url: "https://golden-dragon-chinese-ukrt.vercel.app/", file: "golden-dragon.jpg" },
  { url: "https://restaurant-sigma-peach.vercel.app/", file: "oak-ember.jpg" },
  { url: "https://salon-opal-zeta.vercel.app/", file: "luna-co.jpg" },
];

const VIEWPORT = { width: 1200, height: 900 };

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const { url, file } of SITES) {
    const outputPath = join(OUTPUT_DIR, file);
    try {
      const page = await browser.newPage();
      await page.setViewportSize(VIEWPORT);
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: outputPath,
        type: "jpeg",
        quality: 85,
      });
      await page.close();
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nDone. Screenshots saved to ${OUTPUT_DIR}`);
}

main();
