import { LinearGradient } from 'expo-linear-gradient';

import { cn } from '@/lib/utils';
import { colors } from '@/theme/tokens';

type ScreenGradientProps = {
  className?: string;
  from?: 'surface-elevated' | 'surface';
};

/** Degradê neutro de topo (#1A1A1A → #0A0A0A) que dá profundidade às telas. */
export function ScreenGradient({ className, from = 'surface-elevated' }: ScreenGradientProps) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[colors[from], colors.background]}
      className={cn('absolute left-0 right-0 top-0 h-80', className)}
    />
  );
}
