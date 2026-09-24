import { ArrowLeft, ArrowRight, Maximize2, Pause, Play, RotateCcw, RotateCw } from 'lucide-react-native';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PillButton } from '@/components/PillButton';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/ui/text';
import { formatClock } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Utterance } from '@/types/domain';
import { spacing } from '@/theme/tokens';

type TimelinePlayerProps = {
  utterances: Utterance[];
  durationSec: number;
  currentSec: number;
  playing: boolean;
  rate: number;
  momentIndex: number;
  momentCount: number;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onToggle: () => void;
  onSkip: (delta: number) => void;
  onRate: () => void;
  onExpand?: () => void;
};

const pct = (n: number) => `${Math.min(100, Math.max(0, n * 100))}%` as const;

/** Linha do tempo em duas trilhas (vendedor em cima, cliente embaixo) com o trecho percorrido em primary. */
function Timeline({
  utterances,
  durationSec,
  currentSec,
  onSeek,
}: Pick<TimelinePlayerProps, 'utterances' | 'durationSec' | 'currentSec' | 'onSeek'>) {
  const [width, setWidth] = useState(0);
  const seek = (e: GestureResponderEvent) => {
    if (width > 0) onSeek((e.nativeEvent.locationX / width) * durationSec);
  };

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityLabel="Linha do tempo"
      accessibilityValue={{ min: 0, max: Math.round(durationSec), now: Math.round(currentSec) }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onPress={seek}
      className="h-24 justify-center gap-4"
    >
      {(['seller', 'customer'] as const).map((speaker) => (
        <View key={speaker} className="h-4 w-full rounded-full bg-surface-highlight">
          {utterances
            .filter((u) => u.speaker === speaker)
            .map((u) => {
              const start = u.startSec / durationSec;
              // Segmentos de fala: no máximo 20s por bloco para manter o ritmo visual.
              const end = Math.min(u.endSec, u.startSec + 20) / durationSec;
              const played = u.startSec < currentSec;
              return (
                <View
                  key={u.id}
                  className={cn(
                    'absolute bottom-0 top-0 rounded-full',
                    played ? 'bg-primary' : speaker === 'seller' ? 'bg-text-subtle' : 'bg-border-strong',
                  )}
                  style={{ left: pct(start), width: pct(end - start) }}
                />
              );
            })}
        </View>
      ))}
      <View className="absolute bottom-0 top-0 w-px bg-text" style={{ left: pct(currentSec / durationSec) }} />
    </Pressable>
  );
}

/** Player fixo: Anterior/Próximo entre momentos, linha do tempo, tempos e controles circulares. */
export function TimelinePlayer(props: TimelinePlayerProps) {
  const insets = useSafeAreaInsets();
  const { playing, rate, currentSec, durationSec, momentIndex, momentCount } = props;

  return (
    <View
      className="gap-12 rounded-t-24 border-t border-border bg-surface px-16 pt-16"
      style={{ paddingBottom: Math.max(insets.bottom, spacing[16]) }}
    >
      <View className="flex-row items-center justify-between">
        <PillButton size="sm" label="Anterior" icon={ArrowLeft} onPress={props.onPrev} disabled={momentIndex <= 0} />
        <Text className="font-sans text-12 text-text-muted" style={{ fontVariant: ['tabular-nums'] }}>
          {momentIndex + 1} de {momentCount}
        </Text>
        <PillButton
          size="sm"
          variant="primary"
          label="Próximo"
          icon={ArrowRight}
          iconPosition="right"
          onPress={props.onNext}
          disabled={momentIndex >= momentCount - 1}
        />
      </View>

      <View className="gap-4">
        <Timeline {...props} />
        <View className="flex-row justify-between">
          <Text variant="caption" className="text-text-subtle" style={{ fontVariant: ['tabular-nums'] }}>
            {formatClock(currentSec)}
          </Text>
          <Text variant="caption" className="text-text-subtle" style={{ fontVariant: ['tabular-nums'] }}>
            {formatClock(durationSec)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Velocidade ${rate}x`}
          haptic="selection"
          hitSlop={spacing[4]}
          onPress={props.onRate}
          className="h-40 w-40 items-center justify-center rounded-full bg-surface-elevated"
        >
          <Text className="font-sans text-12">{`${String(rate).replace('.', ',')}x`}</Text>
        </PressableScale>
        <IconButton icon={RotateCcw} label="Voltar 15 segundos" variant="ghost" onPress={() => props.onSkip(-15)} />
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Pausar' : 'Reproduzir'}
          haptic="light"
          onPress={props.onToggle}
          className="h-48 w-48 items-center justify-center rounded-full bg-text"
        >
          <Icon as={playing ? Pause : Play} size="md" color="background" strokeWidth={2} />
        </PressableScale>
        <IconButton icon={RotateCw} label="Avançar 15 segundos" variant="ghost" onPress={() => props.onSkip(15)} />
        <IconButton icon={Maximize2} label="Expandir player" variant="ghost" onPress={props.onExpand} />
      </View>
    </View>
  );
}
