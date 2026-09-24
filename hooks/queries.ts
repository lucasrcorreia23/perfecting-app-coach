import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as api from '@/api';
import type { CoachMessage, Visibility } from '@/types/domain';

export const keys = {
  people: ['people'] as const,
  conversations: ['conversations'] as const,
  conversation: (id: string) => ['conversation', id] as const,
  transcript: (id: string) => ['transcript', id] as const,
  scorecard: (id: string) => ['scorecard', id] as const,
  comments: (id: string) => ['comments', id] as const,
  coach: (id: string) => ['coach', id] as const,
  mentions: ['mentions'] as const,
  performance: ['performance'] as const,
  daySummary: ['daySummary'] as const,
};

export const usePeople = () => useQuery({ queryKey: keys.people, queryFn: api.fetchPeople });

export const useConversations = () => useQuery({ queryKey: keys.conversations, queryFn: api.fetchConversations });

/** Enquanto a conversa está "Processando", consulta de novo a cada segundo. */
export const useConversation = (id: string) =>
  useQuery({
    queryKey: keys.conversation(id),
    queryFn: () => api.fetchConversation(id),
    refetchInterval: (q) => (q.state.data?.status === 'processing' ? 1000 : false),
  });

export const useTranscript = (id: string, enabled = true) =>
  useQuery({ queryKey: keys.transcript(id), queryFn: () => api.fetchTranscript(id), enabled });

export const useScorecard = (id: string, enabled = true) =>
  useQuery({ queryKey: keys.scorecard(id), queryFn: () => api.fetchScorecard(id), enabled });

export const useComments = (id: string) => useQuery({ queryKey: keys.comments(id), queryFn: () => api.fetchComments(id) });

export const useCoachThread = (id: string) => useQuery({ queryKey: keys.coach(id), queryFn: () => api.fetchCoachThread(id) });

export const useMentions = () => useQuery({ queryKey: keys.mentions, queryFn: api.fetchMentions });

export const usePerformance = () => useQuery({ queryKey: keys.performance, queryFn: api.fetchPerformance });

export const useDaySummary = () => useQuery({ queryKey: keys.daySummary, queryFn: api.fetchDaySummary });

export function useCreateRecording() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createRecording,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.conversations }),
  });
}

export function usePostComment(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { startSec: number; endSec: number; text: string; visibility: Visibility }) =>
      api.postComment({ conversationId, ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.comments(conversationId) }),
  });
}

/** Pergunta ao Coach com atualização otimista da pergunta do usuário. */
export function useAskCoach(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (question: string) => api.askCoach(conversationId, question),
    onMutate: async (question) => {
      await qc.cancelQueries({ queryKey: keys.coach(conversationId) });
      qc.setQueryData<CoachMessage[]>(keys.coach(conversationId), (prev = []) => [
        ...prev,
        { id: `pending-${Date.now()}`, role: 'user', text: question },
      ]);
    },
    onSuccess: (thread) => qc.setQueryData(keys.coach(conversationId), thread),
  });
}
