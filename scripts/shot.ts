/**
 * Captura rápida de uma rota em 390x844 (uso em dev, ex: comparar com referência).
 *   npx tsx scripts/shot.ts /dev/tokens out.png [--full] [--scale=2] [--height=844]
 */
import { chromium } from 'playwright';

const [route = '/', out = 'shot.png', ...flags] = process.argv.slice(2);
const full = flags.includes('--full');
const scale = Number(flags.find((f) => f.startsWith('--scale='))?.split('=')[1] ?? 2);
const height = Number(flags.find((f) => f.startsWith('--height='))?.split('=')[1] ?? 844);
const base = process.env.BASE_URL ?? 'http://localhost:8081';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height }, deviceScaleFactor: scale });
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out, fullPage: full });
  if (errors.length) console.log('ERROS:\n' + errors.join('\n'));
  await browser.close();
})();
