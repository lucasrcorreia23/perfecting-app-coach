import { ArrowUpRight, Check } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

import { Icon } from '@/components/Icon';
import { TimestampChip } from '@/components/TimestampChip';
import { Text } from '@/components/ui/text';
import type { ScorePoint, StageScore } from '@/types/domain';
import { motion } from '@/theme/tokens';

/** Barra de progresso branca sobre trilho `border`, animada ao aparecer. */
export function ProgressBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withDelay(delay, withTiming(value, { duration: motion.duration.slow * 2 })));
  }, [delay, progress, value]);
  const style = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));
  return (
    <View className="h-4 w-full overflow-hidden rounded-full bg-border">
      <Animated.View style={style} className="h-4 rounded-full bg-text" />
    </View>
  );
}

function PointList({ title, points, kind, onJump }: { title: string; points: ScorePoint[]; kind: 'strength' | 'improvement'; onJump: (sec: number) => void }) {
  if (points.length === 0) return null;
  return (
    <View className="gap-12">
      <Text variant="label">{title}</Text>
      {points.map((p) => (
        <View key={p.text} className="flex-row gap-8">
          <View className="h-20 items-center justify-center">
            <Icon as={kind === 'strength' ? Check : ArrowUpRight} size="sm" color={kind === 'strength' ? 'success' : 'warning'} />
          </View>
          <View className="flex-1 gap-8">
            <Text variant="body">{p.text}</Text>
            <TimestampChip sec={p.atSec} onPress={() => onJump(p.atSec)} />
          </View>
        </View>
      ))}
    </View>
  );
}

type ScoreCardProps = {
  stage: StageScore;
  weakest?: boolean;
  index?: number;
  onJump: (sec: number) => void;
};

/** Card de etapa do playbook (AVA, SOL, NEG, FECH): nota, barra, pontos fortes e de melhoria. */
export function ScoreCard({ stage, weakest, index = 0, onJump }: ScoreCardProps) {
  return (
    <View className="gap-16 rounded-16 border border-border bg-surface p-16">
      <View className="gap-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-4">
            <View className="flex-row items-center gap-8">
              <Text variant="label">{stage.key}</Text>
              {weakest ? (
                <View accessibilityLabel="Etapa mais fraca" className="h-8 w-8 rounded-full bg-primary" />
              ) : null}
            </View>
            <Text variant="title">{stage.name}</Text>
          </View>
          <Text variant="display-sm">
            {stage.score}/{stage.max}
          </Text>
        </View>
        <ProgressBar value={stage.score / stage.max} delay={index * motion.duration.fast} />
      </View>
      <PointList title="Pontos fortes" points={stage.strengths} kind="strength" onJump={onJump} />
      <PointList title="Pontos de melhoria" points={stage.improvements} kind="improvement" onJump={onJump} />
    </View>
  );
}
