import type { Outcome } from '@/types/domain';

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

/** 902 → "15:02"; 3725 → "1:02:05" */
export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

/** 5520 → "1h 32min"; 2052 → "34min" */
export function formatDuration(totalSec: number): string {
  const min = Math.round(totalSec / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

/** 3840000 → "R$ 38.400" (sem centavos, separador pt-BR). */
export function formatCurrency(cents: number): string {
  const reais = Math.round(cents / 100);
  return `R$ ${String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** 7.5 → "7,5" */
export function formatDecimal(n: number, digits = 1): string {
  return n.toFixed(digits).replace('.', ',');
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function daysBetween(iso: string, now = new Date()): number {
  return Math.round((startOfDay(now).getTime() - startOfDay(new Date(iso)).getTime()) / 86_400_000);
}

/** "Hoje", "Ontem" ou "Seg, 21 set" */
export function formatDay(iso: string): string {
  const diff = daysBetween(iso);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "10:30" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "Hoje · 10:30" */
export function formatDayTime(iso: string): string {
  return `${formatDay(iso)} · ${formatTime(iso)}`;
}

/** Agrupa por "Hoje", "Ontem", "Esta semana", "Anteriores". */
export function sectionFor(iso: string): string {
  const diff = daysBetween(iso);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return 'Esta semana';
  return 'Anteriores';
}

export const OUTCOME_LABEL: Record<Outcome, string> = {
  vendido: 'Vendido',
  nao_vendido: 'Não vendido',
  em_negociacao: 'Em negociação',
};

export function pluralize(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
