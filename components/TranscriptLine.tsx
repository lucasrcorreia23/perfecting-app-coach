import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/ui/text';
import { formatClock } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Person, Utterance } from '@/types/domain';

type TranscriptLineProps = {
  utterance: Utterance;
  name: string;
  initials: string;
  tone: Person['avatarColor'] | 'neutral';
  /**
   * `playing`: fala em reprodução (barra primary + surface-highlight).
   * `quoted`: trecho citado (barra primary + surface-elevated).
   * `selected`: seleção para comentário.
   */
  state?: 'default' | 'playing' | 'quoted' | 'selected';
  onPress?: () => void;
  onLongPress?: () => void;
};

/** Fala da transcrição: avatar com iniciais, nome, timestamp abaixo e texto. */
export function TranscriptLine({ utterance, name, initials, tone, state = 'default', onPress, onLongPress }: TranscriptLineProps) {
  const highlighted = state !== 'default';
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${formatClock(utterance.startSec)}: ${utterance.text}`}
      accessibilityHint="Toque para ouvir. Segure para comentar."
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      className={cn(
        'mx-8 gap-8 overflow-hidden rounded-12 px-12 py-12',
        state === 'playing' && 'bg-surface-highlight',
        state === 'quoted' && 'bg-surface-elevated',
        state === 'selected' && 'bg-surface-elevated',
      )}
    >
      {highlighted ? (
        <View className={cn('absolute bottom-0 left-0 top-0 w-4', state === 'selected' ? 'bg-text-muted' : 'bg-primary')} />
      ) : null}
      <View className="flex-row items-center gap-8">
        <Avatar initials={initials} tone={tone} size="sm" />
        <View>
          <Text className="font-sans text-12">{name}</Text>
          <Text variant="caption" className="text-text-subtle">
            {formatClock(utterance.startSec)}
          </Text>
        </View>
      </View>
      <Text variant="body" className={state === 'default' ? 'text-text-muted' : 'text-text'}>
        {utterance.text}
      </Text>
    </PressableScale>
  );
}
