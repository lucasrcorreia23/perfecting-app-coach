/**
 * Auditoria da escala (grid 4/8).
 *
 * Varre app/, components/, features/ e lib/ e lista:
 *  - classes Tailwind arbitrárias (p-[13px]);
 *  - classes numéricas fora da escala (p-10, text-15, rounded-6...), que o
 *    Tailwind silenciosamente NÃO gera, pois a escala foi substituída;
 *  - números soltos em style={{ }} (diferentes de 0).
 *
 * Uso: npm run audit:scale
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { fontSize, radius, spacing } from '../theme/tokens';

const ROOT = join(__dirname, '..');
const DIRS = ['app', 'components', 'features', 'lib'];
const IGNORE = ['components/logo-paths.ts'];

const SPACING = new Set(Object.keys(spacing));
const RADIUS = new Set(Object.keys(radius));
const FONT = new Set(Object.keys(fontSize));

const SPACING_PREFIX =
  /^-?(p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|w|h|min-w|min-h|max-w|max-h|size|top|bottom|left|right|inset|inset-x|inset-y|start|end|translate-x|translate-y|space-x|space-y)-(\d+(?:\.\d+)?)$/;

type Finding = { file: string; line: number; issue: string };

function walk(dir: string): string[] {
  let out: string[] = [];
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.(tsx?|jsx?)$/.test(e)) out.push(p);
  }
  return out;
}

function checkClass(cls: string): string | null {
  const base = cls.split(':').pop() ?? cls;
  if (/-\[.+\]/.test(base)) return `classe arbitrária "${cls}"`;
  const sp = base.match(SPACING_PREFIX);
  if (sp && !SPACING.has(sp[2]!)) return `"${cls}" fora da escala de spacing`;
  const txt = base.match(/^text-(\d+)$/);
  if (txt && !FONT.has(txt[1]!)) return `"${cls}" fora da escala de fonte`;
  const rd = base.match(/^rounded(?:-[trbl]{1,2})?-(\d+)$/);
  if (rd && !RADIUS.has(rd[1]!)) return `"${cls}" fora da escala de raio`;
  const bw = base.match(/^border(?:-[xytrbl])?-(\d+)$/);
  if (bw && bw[1] !== '0') return `"${cls}" borda diferente de 1`;
  return null;
}

const findings: Finding[] = [];

for (const dir of DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (IGNORE.includes(rel)) continue;
    const src = readFileSync(file, 'utf8');
    const lines = src.split('\n');

    lines.forEach((text, i) => {
      // Strings que parecem listas de classes.
      for (const m of text.matchAll(/(['"`])([^'"`]*?)\1/g)) {
        const str = m[2] ?? '';
        if (!/(^|\s)(p|m|gap|w|h|text|rounded|border|top|left|right|bottom|inset|size)[-\w]*-?/.test(str)) continue;
        for (const cls of str.split(/\s+/).filter(Boolean)) {
          const issue = checkClass(cls);
          if (issue) findings.push({ file: rel, line: i + 1, issue });
        }
      }
    });

    // Números soltos em style={{ ... }}
    for (const m of src.matchAll(/style=\{\{([\s\S]*?)\}\}/g)) {
      const body = m[1] ?? '';
      for (const n of body.matchAll(/:\s*(-?\d+(?:\.\d+)?)\b/g)) {
        if (Number(n[1]) === 0) continue;
        const line = src.slice(0, (m.index ?? 0) + (n.index ?? 0)).split('\n').length;
        findings.push({ file: rel, line, issue: `número solto em style: ${n[1]}` });
      }
    }
  }
}

if (findings.length === 0) {
  console.log('✓ Nenhuma medida fora da escala.');
} else {
  for (const f of findings) console.log(`${f.file}:${f.line}  ${f.issue}`);
  console.log(`\n✗ ${findings.length} ocorrência(s) fora da escala.`);
  process.exitCode = 1;
}
