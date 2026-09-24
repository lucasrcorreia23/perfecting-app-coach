import { Platform, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/ui/text';
import { formatClock } from '@/lib/format';
import { spacing } from '@/theme/tokens';

/** Na web, o badge precisa ser inline dentro do parágrafo. */
const INLINE = Platform.OS === 'web' ? ({ display: 'inline-flex', verticalAlign: 'middle' } as unknown as ViewStyle) : undefined;

/** Citação numerada do Coach: círculo primary-soft (16) com número em primary. */
export function CitationBadge({ n, atSec, onPress }: { n: number; atSec: number; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={`Citação ${n}, ir para ${formatClock(atSec)}`}
      hitSlop={spacing[16]}
      style={INLINE}
      haptic="selection"
      onPress={onPress}
      className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft"
    >
      <Text className="font-sans text-12 text-primary">{n}</Text>
    </PressableScale>
  );
}
