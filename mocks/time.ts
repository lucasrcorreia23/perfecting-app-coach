/** Datas relativas a "agora", para que "Hoje" e "Ontem" façam sentido em qualquer dia. */
export function daysAgo(days: number, time: string): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d.toISOString();
}

/** "27:02" → 1622 */
export function ts(clock: string): number {
  const parts = clock.split(':').map(Number);
  return parts.reduce((acc, n) => acc * 60 + (n ?? 0), 0);
}
