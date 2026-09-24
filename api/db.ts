/**
 * "Banco" em memória do protótipo. As funções de api/index.ts leem e escrevem
 * aqui; para usar a API real, troque só as funções de fetch.
 */
import { coachThreads } from '@/mocks/coach';
import { comments } from '@/mocks/comments';
import { conversations } from '@/mocks/conversations';
import type { CoachMessage, Comment, Conversation } from '@/types/domain';

export const db = {
  conversations: [...conversations] as Conversation[],
  comments: [...comments] as Comment[],
  coach: Object.fromEntries(Object.entries(coachThreads).map(([k, v]) => [k, [...v]])) as Record<string, CoachMessage[]>,
  /** id → timestamp em que o processamento termina */
  processingUntil: {} as Record<string, number>,
};
