import { Play } from 'lucide-react-native';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/ui/text';
import { formatClock } from '@/lib/format';
import { sizes } from '@/theme/tokens';

/** Chip de timestamp em pill (24) que leva ao trecho na transcrição. */
export function TimestampChip({ sec, endSec, onPress }: { sec: number; endSec?: number; onPress: () => void }) {
  const label = endSec !== undefined ? `${formatClock(sec)} – ${formatClock(endSec)}` : formatClock(sec);
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Ir para ${label} na transcrição`}
      hitSlop={sizes.hitSlop[24]}
      haptic="selection"
      onPress={onPress}
      className="h-24 flex-row items-center gap-4 self-start rounded-full bg-surface-elevated px-8"
    >
      <Icon as={Play} size="sm" color="text-muted" />
      <Text className="font-sans text-12 text-text-muted" style={{ fontVariant: ['tabular-nums'] }}>
        {label}
      </Text>
    </PressableScale>
  );
}
