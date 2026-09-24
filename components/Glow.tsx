import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { cn } from '@/lib/utils';
import { colors } from '@/theme/tokens';

type GlowProps = {
  className?: string;
  /** Opacidade máxima no centro. Regra do design system: no máximo 0.08. */
  intensity?: 0.04 | 0.06 | 0.08;
};

/**
 * Brilho radial de primary, "calor de luz e não cor".
 * Preenche o container (posicione com className) e não recebe toques.
 */
export function Glow({ className, intensity = 0.08 }: GlowProps) {
  const id = useId().replace(/:/g, '');
  return (
    <View pointerEvents="none" className={cn('absolute', className)}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={intensity} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
