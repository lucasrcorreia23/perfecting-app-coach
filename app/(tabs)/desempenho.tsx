import { Swords, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { PillButton } from '@/components/PillButton';
import { PressableScale } from '@/components/PressableScale';
import { ProgressBar } from '@/components/ScoreCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WeeklyBars } from '@/components/WeeklyBars';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { usePerformance } from '@/hooks/queries';
import { formatDecimal } from '@/lib/format';
import { cn } from '@/lib/utils';
import { personById } from '@/mocks/people';
import { motion, sizes, spacing } from '@/theme/tokens';

export default function DesempenhoScreen() {
  const insets = useSafeAreaInsets();
  const { data, isPending } = usePerformance();
  const [sellerId, setSellerId] = useState('p1');
  const perf = data?.find((p) => p.sellerId === sellerId);
  const bottom = sizes.tabBar + Math.max(insets.bottom, spacing[16]) + spacing[24];

  const last = perf?.weeks.at(-1)?.score ?? 0;
  const prev = perf?.weeks.at(-2)?.score ?? 0;
  const delta = last - prev;
  const weakest = perf?.stages.reduce((min, s) => (s.average < min.average ? s : min), perf.stages[0]!);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Desempenho" />
      <ScrollView contentContainerClassName="gap-24 px-16" contentContainerStyle={{ paddingBottom: bottom }} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-8">
          {(data ?? []).map((p) => {
            const person = personById(p.sellerId);
            const active = p.sellerId === sellerId;
            return (
              <PressableScale
                key={p.sellerId}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={person.name}
                haptic="selection"
                onPress={() => setSellerId(p.sellerId)}
                className={cn(
                  'h-40 flex-row items-center gap-8 rounded-full border pl-8 pr-16',
                  active ? 'border-border-strong bg-surface-highlight' : 'border-border bg-surface',
                )}
              >
                <Avatar initials={person.initials} tone={person.avatarColor} size="sm" />
                <Text className={active ? 'font-medium text-14 text-text' : 'font-medium text-14 text-text-muted'}>
                  {person.name.split(' ')[0]}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>

        {isPending || !perf ? (
          <View className="gap-16">
            <Skeleton className="h-80 w-full rounded-16" />
            <Skeleton className="h-80 w-full rounded-16" />
          </View>
        ) : (
          <>
            <View className="gap-24 rounded-16 border border-border bg-surface p-16">
              <View className="flex-row items-end justify-between">
                <View className="gap-4">
                  <Text variant="label">Nota média · semana</Text>
                  <Text variant="display-lg">{formatDecimal(last)}</Text>
                </View>
                <View className="items-end gap-4 pb-4">
                  <View className="flex-row items-center gap-4">
                    <Icon as={delta >= 0 ? TrendingUp : TrendingDown} size="sm" color={delta >= 0 ? 'success' : 'danger'} />
                    <Text className={cn('font-sans text-12', delta >= 0 ? 'text-success' : 'text-danger')}>
                      {delta >= 0 ? '+' : ''}
                      {formatDecimal(delta)}
                    </Text>
                  </View>
                  <Text variant="caption">{perf.conversations} conversas</Text>
                </View>
              </View>
              <WeeklyBars key={sellerId} weeks={perf.weeks} />
            </View>

            <View className="gap-12">
              <Text variant="label">Média por etapa do playbook</Text>
              <View className="gap-16 rounded-16 border border-border bg-surface p-16">
                {perf.stages.map((s, i) => (
                  <View key={`${sellerId}-${s.key}`} className="gap-8">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-8">
                        <Text className="w-40 font-sans text-12 text-text-muted">{s.key}</Text>
                        <Text variant="subtitle">{s.name}</Text>
                        {s.key === weakest?.key ? <View accessibilityLabel="Etapa mais fraca" className="h-8 w-8 rounded-full bg-primary" /> : null}
                      </View>
                      <Text className="font-medium text-14" style={{ fontVariant: ['tabular-nums'] }}>
                        {formatDecimal(s.average)}
                        <Text className="font-medium text-14 text-text-subtle">/3</Text>
                      </Text>
                    </View>
                    <ProgressBar value={s.average / 3} delay={i * motion.duration.fast * 0.5} />
                  </View>
                ))}
              </View>
            </View>

            {weakest ? (
              <View className="gap-16 rounded-16 border border-border bg-surface p-16">
                <View className="flex-row items-center gap-8">
                  <Icon as={Swords} size="sm" color="text-muted" />
                  <Text variant="label">Etapa mais fraca · {weakest.key}</Text>
                </View>
                <View className="gap-8">
                  <Text variant="title">{perf.suggestion.title}</Text>
                  <Text variant="body" className="text-text-muted">
                    {perf.suggestion.description}
                  </Text>
                </View>
                <View className="flex-row">
                  <PillButton size="lg" variant="accent" label="Treinar com cliente simulado" />
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
