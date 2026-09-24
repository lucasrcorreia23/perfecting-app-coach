import { router, useLocalSearchParams } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { CoachTab } from '@/features/conversation/CoachTab';
import { CommentsTab } from '@/features/conversation/CommentsTab';
import { ConversationContext, type DetailTab, type Range } from '@/features/conversation/context';
import { ConversationHeader } from '@/features/conversation/ConversationHeader';
import { DetailTabs } from '@/features/conversation/DetailTabs';
import { FeedbackTab } from '@/features/conversation/FeedbackTab';
import { ProcessingState } from '@/features/conversation/ProcessingState';
import { TranscriptTab } from '@/features/conversation/TranscriptTab';
import { useComments, useConversation, useTranscript } from '@/hooks/queries';
import { useDemo } from '@/lib/demo';
import { haptics } from '@/lib/haptics';
import { usePlayer } from '@/stores/player';
import { motion, spacing } from '@/theme/tokens';

const TABS: DetailTab[] = ['transcricao', 'feedback', 'coach', 'comentarios'];
const TICK_MS = 250;

function HeaderSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + spacing[8] }} className="items-center gap-8 px-16 pb-16">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-20 w-2/3" />
      <View className="flex-row gap-8">
        <Skeleton className="h-24 w-48 rounded-full" />
        <Skeleton className="h-24 w-64 rounded-full" />
      </View>
    </View>
  );
}

export default function ConversationScreen() {
  const params = useLocalSearchParams<{ id: string; tab?: string; at?: string; from?: string; to?: string }>();
  const id = params.id;
  const demo = useDemo();
  const conversation = useConversation(id);
  const ready = conversation.data?.status === 'ready';
  const transcript = useTranscript(id, ready);
  const comments = useComments(id);

  const initialTab = TABS.includes(params.tab as DetailTab) ? (params.tab as DetailTab) : 'transcricao';
  const [tab, setTab] = useState<DetailTab>(initialTab);
  const [anchor, setAnchor] = useState<Range | null>(() =>
    params.from && params.to ? { startSec: Number(params.from), endSec: Number(params.to) } : null,
  );

  const load = usePlayer((s) => s.load);
  const seek = usePlayer((s) => s.seek);
  const playing = usePlayer((s) => s.playing);
  const tick = usePlayer((s) => s.tick);

  // Carrega o player: ?at= tem prioridade; no demo, fica no 2º momento ("2 de 8").
  const moments = transcript.data?.moments;
  useEffect(() => {
    if (!conversation.data || !ready || transcript.data === undefined) return;
    const second = moments?.[1]?.atSec ?? 0;
    const start = params.at ? Number(params.at) : demo ? second + 15 : 0;
    load(id, conversation.data.durationSec, start);
  }, [conversation.data, ready, transcript.data, moments, params.at, demo, id, load]);

  // Reprodução simulada por relógio.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => tick(TICK_MS / 1000), TICK_MS);
    return () => clearInterval(t);
  }, [playing, tick]);

  const jumpTo = useCallback(
    (sec: number) => {
      haptics.selection();
      seek(sec);
      setTab('transcricao');
    },
    [seek],
  );

  const commentOn = useCallback((range: Range) => {
    haptics.light();
    setAnchor(range);
    setTab('comentarios');
  }, []);

  const value = useMemo(
    () =>
      conversation.data
        ? { conversation: conversation.data, transcript: transcript.data, tab, setTab, jumpTo, commentOn, anchor, demo }
        : null,
    [conversation.data, transcript.data, tab, jumpTo, commentOn, anchor, demo],
  );

  if (conversation.isPending) {
    return (
      <View className="flex-1 bg-background">
        <HeaderSkeleton />
      </View>
    );
  }

  if (!value) {
    return (
      <View className="flex-1 justify-center bg-background">
        <EmptyState
          icon={SearchX}
          title="Conversa não encontrada"
          description="Ela pode ter sido removida ou o link está incorreto."
          action={{ label: 'Ver conversas', onPress: () => router.navigate('/conversas') }}
        />
      </View>
    );
  }

  return (
    <ConversationContext.Provider value={value}>
      <View className="flex-1 bg-background">
        <ConversationHeader conversation={value.conversation} />
        <DetailTabs value={tab} onChange={setTab} counts={{ comentarios: comments.data?.length }} />
        {!ready ? (
          <ProcessingState />
        ) : (
          <Animated.View key={tab} entering={FadeIn.duration(motion.duration.base)} className="flex-1">
            {tab === 'transcricao' ? <TranscriptTab /> : null}
            {tab === 'feedback' ? <FeedbackTab /> : null}
            {tab === 'coach' ? <CoachTab /> : null}
            {tab === 'comentarios' ? <CommentsTab /> : null}
          </Animated.View>
        )}
      </View>
    </ConversationContext.Provider>
  );
}
