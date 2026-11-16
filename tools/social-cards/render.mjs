// Renders the link-preview card into public/og-showtime.png.
// Needs Playwright: node tools/social-cards/render.mjs (set PLAYWRIGHT to another install's
// node_modules/playwright if this project does not have it)
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '..', '..', 'public');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(here, 'showtime.html')).href);
await page.screenshot({ path: path.join(pub, 'og-showtime.png') });
await browser.close();
