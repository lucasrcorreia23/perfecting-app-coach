import { ClipboardCheck, Swords } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { PillButton } from '@/components/PillButton';
import { ScoreCard } from '@/components/ScoreCard';
import { TimestampChip } from '@/components/TimestampChip';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useScorecard } from '@/hooks/queries';
import { formatDecimal } from '@/lib/format';
import { motion } from '@/theme/tokens';

import { useConversationContext } from './context';

export function FeedbackTab() {
  const { conversation, jumpTo } = useConversationContext();
  const { data, isPending } = useScorecard(conversation.id);

  if (isPending) {
    return (
      <View className="gap-16 px-16 pt-24">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-48 w-1/3" />
        <Skeleton className="h-16 w-full" />
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-16" />
        ))}
      </View>
    );
  }
  if (!data) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="Feedback indisponível"
        description="O scorecard por etapa é gerado para conversas com transcrição completa."
      />
    );
  }

  const weakest = data.stages.reduce((min, s) => (s.score / s.max < min.score / min.max ? s : min), data.stages[0]!);

  return (
    <ScrollView contentContainerClassName="gap-24 px-16 pb-48 pt-24" showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(motion.duration.slow)} className="gap-8">
        <Text variant="label">Nota geral</Text>
        <View className="flex-row items-end gap-12">
          <Text variant="display-lg" style={{ fontVariant: ['tabular-nums'] }}>
            {data.total}/{data.max}
          </Text>
          <Text variant="caption" className="pb-4">
            Média da equipe {formatDecimal(data.teamAverage)}
          </Text>
        </View>
        <Text variant="body" className="text-text-muted">
          {data.headline}
        </Text>
      </Animated.View>

      <View className="gap-12">
        {data.stages.map((s, i) => (
          <ScoreCard key={s.key} stage={s} index={i} weakest={s.key === weakest.key} onJump={jumpTo} />
        ))}
      </View>

      <View className="gap-16 rounded-16 border border-border bg-surface p-16">
        <View className="flex-row items-center gap-8">
          <Icon as={Swords} size="sm" color="text-muted" />
          <Text variant="label">Roleplay Perfecting</Text>
        </View>
        <View className="gap-8">
          <Text variant="title">Treine esta objeção com um cliente simulado</Text>
          <Text variant="subtitle">{data.training.objection}</Text>
          <Text variant="body" className="text-text-muted">
            “{data.training.quote}”
          </Text>
          <TimestampChip sec={data.training.atSec} onPress={() => jumpTo(data.training.atSec)} />
        </View>
        <View className="flex-row">
          <PillButton size="lg" variant="accent" label="Começar treino" />
        </View>
      </View>
    </ScrollView>
  );
}
