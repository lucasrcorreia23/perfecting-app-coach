import type { Speaker, Utterance } from '@/types/domain';

import { ts } from '../time';

type Row = [clock: string, speaker: Speaker, text: string];

/** Converte linhas [mm:ss, falante, texto] em falas com início e fim. */
export function buildUtterances(prefix: string, rows: Row[], totalSec: number): Utterance[] {
  return rows.map(([clock, speaker, text], i) => {
    const next = rows[i + 1];
    const startSec = ts(clock);
    const endSec = next ? ts(next[0]) : totalSec;
    return { id: `${prefix}-u${i + 1}`, speaker, startSec, endSec, text };
  });
}
