import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { formatDecimal } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { WeekScore } from '@/types/domain';
import { motion, sizes, spacing } from '@/theme/tokens';

const MAX_SCORE = 12;

function Bar({ week, index, current }: { week: WeekScore; index: number; current: boolean }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.set(withDelay(index * motion.duration.fast * 0.5, withTiming(week.score / MAX_SCORE, { duration: motion.duration.slow * 2 })));
  }, [h, index, week.score]);
  const style = useAnimatedStyle(() => ({ height: h.get() * (sizes.chart - spacing[20]) }));

  return (
    <View className="flex-1 items-center gap-8">
      <View className="w-full items-center justify-end gap-4" style={{ height: sizes.chart }}>
        <Text variant="caption" className={current ? 'text-text' : 'text-text-subtle'} style={{ fontVariant: ['tabular-nums'] }}>
          {formatDecimal(week.score)}
        </Text>
        <Animated.View style={style} className={cn('w-24 rounded-8', current ? 'bg-text' : 'bg-border-strong')} />
      </View>
      <Text variant="caption" className={current ? 'text-text' : 'text-text-subtle'}>
        {week.label}
      </Text>
    </View>
  );
}

/** Barras semanais da nota (0–12), última semana em branco e as anteriores em cinza. */
export function WeeklyBars({ weeks }: { weeks: WeekScore[] }) {
  return (
    <View accessibilityRole="image" accessibilityLabel={`Notas das últimas ${weeks.length} semanas`} className="flex-row gap-4">
      {weeks.map((w, i) => (
        <Bar key={w.label} week={w} index={i} current={i === weeks.length - 1} />
      ))}
    </View>
  );
}
