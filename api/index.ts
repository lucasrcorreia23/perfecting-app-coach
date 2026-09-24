import { coachAnswers, defaultCoachAnswer } from '@/mocks/coach';
import { mentions } from '@/mocks/comments';
import { daySummary, performance } from '@/mocks/performance';
import { CURRENT_USER_ID, people } from '@/mocks/people';
import { scorecards } from '@/mocks/scorecards';
import { transcriptC1 } from '@/mocks/transcripts/c1';
import { transcriptC2 } from '@/mocks/transcripts/c2';
import { isDemo } from '@/lib/demo';
import type { CoachMessage, Comment, Conversation, Transcript, Visibility } from '@/types/domain';

import { db } from './db';

const transcripts: Record<string, Transcript> = { c1: transcriptC1, c2: transcriptC2 };

/** Tempo de "processamento" de uma gravação nova. */
export const PROCESSING_MS = 4000;

/** Latência simulada (desligada no modo demo). */
function latency(min = 300, max = 700): Promise<void> {
  if (isDemo()) return Promise.resolve();
  return new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));
}

function resolve(conversation: Conversation): Conversation {
  const until = db.processingUntil[conversation.id];
  if (until && Date.now() >= until && conversation.status === 'processing') {
    const template = db.conversations.find((c) => c.id === conversation.templateId);
    Object.assign(conversation, {
      status: 'ready',
      score: template?.score ?? 0,
      outcome: template?.outcome ?? 'em_negociacao',
      valueCents: template?.valueCents ?? 0,
      summary: template?.summary ?? '',
      hasTranscript: true,
    });
  }
  return conversation;
}

/** Conversas gravadas no app usam os dados da conversa-modelo. */
function sourceId(id: string): string {
  return db.conversations.find((c) => c.id === id)?.templateId ?? id;
}

export async function fetchPeople() {
  await latency(100, 200);
  return people;
}

export async function fetchConversations(): Promise<Conversation[]> {
  await latency();
  return db.conversations.map(resolve).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export async function fetchConversation(id: string): Promise<Conversation | null> {
  await latency(200, 400);
  const c = db.conversations.find((x) => x.id === id);
  return c ? { ...resolve(c) } : null;
}

export async function fetchTranscript(id: string): Promise<Transcript | null> {
  await latency();
  return transcripts[sourceId(id)] ?? null;
}

export async function fetchScorecard(id: string) {
  await latency();
  return scorecards[sourceId(id)] ?? null;
}

export async function fetchComments(id: string): Promise<Comment[]> {
  await latency(200, 400);
  const src = sourceId(id);
  return db.comments
    .filter((c) => c.conversationId === id || c.conversationId === src)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function fetchCoachThread(id: string): Promise<CoachMessage[]> {
  await latency(200, 400);
  return [...(db.coach[id] ?? db.coach[sourceId(id)] ?? [])];
}

export async function fetchMentions() {
  await latency();
  return [...mentions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function fetchPerformance() {
  await latency();
  return performance;
}

export async function fetchDaySummary() {
  await latency(200, 400);
  return daySummary;
}

export async function createRecording(input: { title: string; durationSec: number }): Promise<Conversation> {
  await latency(200, 300);
  const id = `r${Date.now()}`;
  const conversation: Conversation = {
    id,
    title: input.title,
    customer: 'Cliente presencial',
    segment: 'Móveis planejados',
    sellerId: 'p1',
    startedAt: new Date(Date.now() - input.durationSec * 1000).toISOString(),
    durationSec: Math.max(input.durationSec, 1),
    score: 0,
    maxScore: 12,
    outcome: 'em_negociacao',
    valueCents: 0,
    summary: '',
    status: 'processing',
    hasTranscript: false,
    templateId: 'c1',
  };
  db.conversations.unshift(conversation);
  db.processingUntil[id] = Date.now() + PROCESSING_MS;
  return conversation;
}

export async function postComment(input: {
  conversationId: string;
  startSec: number;
  endSec: number;
  text: string;
  visibility: Visibility;
}): Promise<Comment> {
  await latency(200, 400);
  const comment: Comment = {
    id: `k${Date.now()}`,
    authorId: CURRENT_USER_ID,
    createdAt: new Date().toISOString(),
    ...input,
  };
  db.comments.push(comment);
  return comment;
}

export async function askCoach(conversationId: string, question: string): Promise<CoachMessage[]> {
  const thread = (db.coach[conversationId] ??= []);
  thread.push({ id: `q${Date.now()}`, role: 'user', text: question });
  await latency(1200, 1800);
  thread.push({ id: `a${Date.now()}`, role: 'assistant', blocks: coachAnswers[question] ?? defaultCoachAnswer });
  return [...thread];
}
