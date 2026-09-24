import { ArrowDown, FileText, MessageSquarePlus, Mic, Video, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { PillButton } from '@/components/PillButton';
import { TimelinePlayer } from '@/components/TimelinePlayer';
import { TranscriptLine } from '@/components/TranscriptLine';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { formatClock } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { usePlayer } from '@/stores/player';
import { spacing } from '@/theme/tokens';

import { useConversationContext } from './context';
import { speakerInfo } from './speakers';

type Selection = { from: number; to: number } | null;

export function TranscriptSkeleton() {
  return (
    <View className="gap-24 px-16 pt-16">
      <View className="gap-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-3/4" />
      </View>
      {[0, 1, 2].map((i) => (
        <View key={i} className="gap-8">
          <View className="flex-row items-center gap-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-12 w-1/4" />
          </View>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-5/6" />
        </View>
      ))}
    </View>
  );
}

export function TranscriptTab() {
  const { conversation, transcript, commentOn, demo } = useConversationContext();
  const insets = useSafeAreaInsets();
  const player = usePlayer();
  const scroll = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});
  const [viewport, setViewport] = useState({ offset: 0, height: 0 });
  const [following, setFollowing] = useState(!demo);
  const [selection, setSelection] = useState<Selection>(null);
  const didInitialScroll = useRef(false);

  const utterances = useMemo(() => transcript?.utterances ?? [], [transcript]);
  const moments = useMemo(() => transcript?.moments ?? [], [transcript]);

  const activeIndex = useMemo(() => {
    let idx = 0;
    utterances.forEach((u, i) => {
      if (u.startSec <= player.currentSec) idx = i;
    });
    return idx;
  }, [utterances, player.currentSec]);
  const active = utterances[activeIndex];

  const momentIndex = useMemo(() => {
    let idx = 0;
    moments.forEach((m, i) => {
      if (m.atSec <= player.currentSec + 0.5) idx = i;
    });
    return idx;
  }, [moments, player.currentSec]);

  const scrollToActive = useCallback(
    (animated = true) => {
      if (!active) return;
      const y = positions.current[active.id];
      if (y === undefined) return;
      scroll.current?.scrollTo({ y: Math.max(0, y - spacing[48]), animated });
    },
    [active],
  );

  // Acompanha a fala ativa enquanto o usuário não rolar manualmente.
  useEffect(() => {
    if (following) scrollToActive();
  }, [activeIndex, following, scrollToActive]);

  const onLineLayout = (id: string) => (e: LayoutChangeEvent) => {
    positions.current[id] = e.nativeEvent.layout.y;
    if (!didInitialScroll.current && active && id === active.id) {
      didInitialScroll.current = true;
      requestAnimationFrame(() => scrollToActive(false));
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setViewport((v) => ({ ...v, offset: e.nativeEvent.contentOffset.y }));

  const activeY = active ? positions.current[active.id] : undefined;
  const activeVisible =
    activeY !== undefined && activeY >= viewport.offset && activeY <= viewport.offset + viewport.height - spacing[48];
  const showGoToNow = !selection && (!following || !activeVisible);

  const seekMoment = (i: number) => {
    const m = moments[i];
    if (!m) return;
    haptics.selection();
    setFollowing(true);
    player.seek(m.atSec);
  };

  const onLinePress = (i: number) => {
    if (selection) {
      setSelection((s) => (s ? { from: Math.min(s.from, i), to: Math.max(s.to, i) } : s));
      haptics.selection();
      return;
    }
    const u = utterances[i];
    if (!u) return;
    setFollowing(true);
    player.seek(u.startSec);
  };

  const onLineLongPress = (i: number) => {
    haptics.medium();
    player.pause();
    setSelection({ from: i, to: i });
  };

  const selectionRange = selection
    ? { startSec: utterances[selection.from]!.startSec, endSec: utterances[selection.to]!.endSec }
    : null;

  if (transcript === undefined) return <TranscriptSkeleton />;
  if (transcript === null) {
    return (
      <EmptyState
        icon={FileText}
        title="Transcrição indisponível"
        description="Esta conversa foi registrada antes da transcrição automática. As próximas gravações terão transcrição completa."
      />
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1">
        <ScrollView
          ref={scroll}
          onLayout={(e) => setViewport((v) => ({ ...v, height: e.nativeEvent.layout.height }))}
          onScroll={onScroll}
          onScrollBeginDrag={() => setFollowing(false)}
          scrollEventThrottle={32}
          contentContainerClassName="gap-4 pb-24 pt-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8 px-16 pb-12">
            <Text variant="label">Resumo da IA</Text>
            <Text variant="body" className="text-text-muted">
              {transcript.summary}
            </Text>
          </View>
          {utterances.map((u, i) => {
            const info = speakerInfo(conversation, transcript, u.speaker);
            const selected = selection && i >= selection.from && i <= selection.to;
            return (
              <View key={u.id} onLayout={onLineLayout(u.id)}>
                <TranscriptLine
                  utterance={u}
                  {...info}
                  state={selected ? 'selected' : !selection && i === activeIndex ? 'playing' : 'default'}
                  onPress={() => onLinePress(i)}
                  onLongPress={() => onLineLongPress(i)}
                />
              </View>
            );
          })}
        </ScrollView>

        {showGoToNow ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute left-0 right-0 top-8 items-center" pointerEvents="box-none">
            <PillButton
              size="sm"
              variant="secondary"
              icon={ArrowDown}
              label="Ir para o agora"
              className="border border-border-strong"
              onPress={() => {
                setFollowing(true);
                scrollToActive();
              }}
            />
          </Animated.View>
        ) : null}
      </View>

      {selection && selectionRange ? (
        <View
          className="gap-12 rounded-t-24 border-t border-border bg-surface px-16 pt-16"
          style={{ paddingBottom: Math.max(insets.bottom, spacing[16]) }}
        >
          <Text variant="caption">
            {selection.to - selection.from + 1} {selection.to === selection.from ? 'fala selecionada' : 'falas selecionadas'} ·{' '}
            {formatClock(selectionRange.startSec)} a {formatClock(selectionRange.endSec)}
          </Text>
          <Text variant="caption" className="text-text-subtle">
            Toque em outras falas para ampliar o trecho.
          </Text>
          <View className="flex-row items-center justify-between">
            <IconButton icon={X} label="Cancelar seleção" onPress={() => setSelection(null)} />
            <PillButton
              size="lg"
              variant="accent"
              icon={MessageSquarePlus}
              label="Comentar trecho"
              onPress={() => {
                setSelection(null);
                commentOn(selectionRange);
              }}
            />
          </View>
        </View>
      ) : (
        <>
          <View className="mx-16 mb-8 h-48 flex-row items-center justify-around rounded-16 bg-surface-elevated">
            <IconButton
              icon={MessageSquarePlus}
              label="Comentar este trecho"
              variant="ghost"
              onPress={() => active && commentOn({ startSec: active.startSec, endSec: active.endSec })}
            />
            <IconButton icon={Mic} label="Comentar com áudio" variant="ghost" />
            <IconButton icon={Video} label="Criar clipe" variant="ghost" />
          </View>
          <TimelinePlayer
            utterances={utterances}
            durationSec={conversation.durationSec}
            currentSec={player.currentSec}
            playing={player.playing}
            rate={player.rate}
            momentIndex={momentIndex}
            momentCount={moments.length}
            onPrev={() => seekMoment(player.currentSec - (moments[momentIndex]?.atSec ?? 0) > 3 ? momentIndex : momentIndex - 1)}
            onNext={() => seekMoment(momentIndex + 1)}
            onSeek={(s) => {
              setFollowing(true);
              player.seek(s);
            }}
            onToggle={() => {
              setFollowing(true);
              player.toggle();
            }}
            onSkip={player.skip}
            onRate={player.cycleRate}
          />
        </>
      )}
    </View>
  );
}
