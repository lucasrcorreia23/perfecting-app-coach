import type { ColorToken } from '@/theme/tokens';

export type PersonRole = 'vendedor' | 'gestor';

export type Person = {
  id: string;
  name: string;
  initials: string;
  role: PersonRole;
  store: string;
  avatarColor: Extract<ColorToken, 'avatar-1' | 'avatar-2' | 'avatar-3' | 'avatar-4'>;
};

export type Outcome = 'vendido' | 'nao_vendido' | 'em_negociacao';

export type ConversationStatus = 'ready' | 'processing';

export type Conversation = {
  id: string;
  title: string;
  customer: string;
  segment: string;
  sellerId: string;
  /** ISO 8601 */
  startedAt: string;
  durationSec: number;
  score: number;
  maxScore: 12;
  outcome: Outcome;
  valueCents: number;
  summary: string;
  status: ConversationStatus;
  hasTranscript: boolean;
  /** Conversas recém-gravadas usam os dados de uma conversa-modelo. */
  templateId?: string;
};

export type Speaker = 'seller' | 'customer';

export type Utterance = {
  id: string;
  speaker: Speaker;
  startSec: number;
  endSec: number;
  text: string;
};

export type Moment = {
  id: string;
  label: string;
  atSec: number;
};

export type Transcript = {
  conversationId: string;
  customerName: string;
  customerInitials: string;
  summary: string;
  utterances: Utterance[];
  /** Momentos marcados (navegação "2 de 8" do player). */
  moments: Moment[];
};

export type StageKey = 'AVA' | 'SOL' | 'NEG' | 'FECH';

export type ScorePoint = { text: string; atSec: number };

export type StageScore = {
  key: StageKey;
  name: string;
  score: number;
  max: 3;
  strengths: ScorePoint[];
  improvements: ScorePoint[];
};

export type Scorecard = {
  conversationId: string;
  total: number;
  max: 12;
  teamAverage: number;
  headline: string;
  stages: StageScore[];
  training: { objection: string; quote: string; atSec: number };
};

export type Visibility = 'public' | 'private';

export type Comment = {
  id: string;
  conversationId: string;
  authorId: string;
  createdAt: string;
  startSec: number;
  endSec: number;
  text: string;
  visibility: Visibility;
};

/** Trecho de texto de uma resposta do Coach: texto corrido ou citação numerada. */
export type CoachInline = { type: 'text'; text: string } | { type: 'cite'; n: number; atSec: number };

export type CoachBlock =
  | { type: 'paragraph'; content: CoachInline[] }
  | { type: 'list'; items: CoachInline[][] };

export type CoachMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; blocks: CoachBlock[] };

export type Mention = {
  id: string;
  conversationId: string;
  authorId: string;
  createdAt: string;
  startSec: number;
  endSec: number;
  excerptSpeaker: string;
  excerpt: string;
  text: string;
  read: boolean;
};

export type WeekScore = { label: string; score: number };

export type SellerPerformance = {
  sellerId: string;
  weeks: WeekScore[];
  stages: { key: StageKey; name: string; average: number }[];
  conversations: number;
  suggestion: { title: string; description: string };
};

export type DaySummary = {
  recordedToday: number;
  averageScore: number;
  weeklyGoal: { done: number; target: number };
};
