/**
 * Helpers for pacing browser automation so it reads like a person, not a bot.
 *
 * This engine is designed to run at low volume (~hourly, ~24 runs/day), so we
 * can afford to be slow and deliberate. Everything here adds jitter rather than
 * fixed sleeps.
 */

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Type into a Playwright locator character-by-character with human-ish delays. */
export async function humanType(locator, text) {
  for (const ch of text) {
    await locator.pressSequentially(ch, { delay: randInt(45, 170) });
    if (Math.random() < 0.1) await sleep(randInt(150, 500)); // occasional pause
  }
}

/** A few lazy scroll nudges, as if skimming the page. */
export async function humanScroll(page) {
  const steps = randInt(2, 5);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, randInt(200, 650));
    await sleep(randInt(350, 950));
  }
}

/** Small idle wander before the next deliberate action. */
export async function settle(page) {
  await page.mouse.move(randInt(100, 900), randInt(100, 600), { steps: randInt(3, 8) });
  await sleep(randInt(400, 1300));
}
