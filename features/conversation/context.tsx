import { createContext, useContext } from 'react';

import type { Conversation, Transcript } from '@/types/domain';

export type DetailTab = 'transcricao' | 'feedback' | 'coach' | 'comentarios';

export type Range = { startSec: number; endSec: number };

type ConversationContextValue = {
  conversation: Conversation;
  transcript: Transcript | null | undefined;
  tab: DetailTab;
  setTab: (tab: DetailTab) => void;
  /** Leva à Transcrição no instante indicado. */
  jumpTo: (sec: number) => void;
  /** Abre Comentários ancorado no intervalo. */
  commentOn: (range: Range) => void;
  anchor: Range | null;
  demo: boolean;
};

export const ConversationContext = createContext<ConversationContextValue | null>(null);

export function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversationContext fora de ConversationContext');
  return ctx;
}
