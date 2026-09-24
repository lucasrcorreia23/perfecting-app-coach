/**
 * Screenshots de apresentação (Playwright).
 *
 *   npm run screenshots               → screenshots/*.png (390x844 @3x = 1170x2532)
 *   npm run screenshots -- --marketing → screenshots/marketing/*.png (1290x2796)
 *
 * Usa o servidor web em BASE_URL (padrão http://localhost:8081); se não houver,
 * sobe `npx expo start --web` e derruba ao final.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from 'playwright';

import { SCENES } from '../features/marketing/scenes';

const BASE = process.env.BASE_URL ?? 'http://localhost:8081';
const OUT = join(__dirname, '..', 'screenshots');
const marketing = process.argv.includes('--marketing');
const SETTLE_MS = 2200;

async function isUp() {
  try {
    return (await fetch(BASE)).ok;
  } catch {
    return false;
  }
}

async function ensureServer(): Promise<ChildProcess | null> {
  if (await isUp()) return null;
  console.log('Subindo o servidor web do Expo…');
  const proc = spawn('npx', ['expo', 'start', '--web', '--port', new URL(BASE).port || '8081'], {
    cwd: join(__dirname, '..'),
    env: { ...process.env, CI: '1', BROWSER: 'none' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 90; i++) {
    if (await isUp()) return proc;
    await new Promise((r) => setTimeout(r, 1000));
  }
  proc.kill();
  throw new Error('Servidor não respondeu em 90s');
}

(async () => {
  const server = await ensureServer();
  const browser = await chromium.launch();
  const dir = marketing ? join(OUT, 'marketing') : OUT;
  mkdirSync(dir, { recursive: true });

  const viewport = marketing ? { width: 430, height: 932 } : { width: 390, height: 844 };
  const page = await browser.newPage({ viewport, deviceScaleFactor: 3 });

  for (const [i, scene] of SCENES.entries()) {
    const url = marketing ? `${BASE}/dev/marketing?scene=${scene.key}` : `${BASE}${scene.route}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(marketing ? SETTLE_MS * 2 : SETTLE_MS);
    const file = join(dir, `${String(i + 1).padStart(2, '0')}-${scene.key}.png`);
    await page.screenshot({ path: file });
    console.log('✓', file);
  }

  await browser.close();
  server?.kill();
})();
