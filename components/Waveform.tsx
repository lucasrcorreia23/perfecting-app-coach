import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/utils';
import { motion, spacing } from '@/theme/tokens';

const MIN = spacing[4];
const MAX = spacing[64];

function Bar({ level, active }: { level: number; active: boolean }) {
  const style = useAnimatedStyle(() => ({
    height: withTiming(MIN + level * (MAX - MIN), { duration: motion.duration.fast }),
  }));
  return <Animated.View style={style} className={cn('w-4 rounded-full', active ? 'bg-primary' : 'bg-border-strong')} />;
}

type WaveformProps = {
  /** Níveis 0..1, do mais antigo (esquerda) ao mais recente (direita). */
  levels: number[];
  active?: boolean;
  className?: string;
};

/** Waveform horizontal espelhada: barras de 4 com gap 4 em até 64 de altura. */
export function Waveform({ levels, active = true, className }: WaveformProps) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Nível do áudio"
      className={cn('h-64 flex-row items-center justify-center gap-4', className)}
    >
      {levels.map((l, i) => (
        <Bar key={i} level={l} active={active} />
      ))}
    </View>
  );
}
