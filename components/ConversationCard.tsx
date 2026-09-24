import { router } from 'expo-router';
import { CircleCheck, LoaderCircle } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { PressableScale } from '@/components/PressableScale';
import { StatusPill } from '@/components/StatusPill';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { formatCurrency, formatDay, formatDuration, formatTime, OUTCOME_LABEL } from '@/lib/format';
import { personById } from '@/mocks/people';
import type { Conversation } from '@/types/domain';

type ConversationCardProps = {
  conversation: Conversation;
  /** `row` (inbox) e `card` (Início) são cartões; `row` usa a hora curta quando a seção já diz o dia. */
  variant?: 'row' | 'card';
  /** Resumo de IA em 2 linhas. Desligado por padrão para listas mais limpas. */
  showSummary?: boolean;
};

/** Item de conversa: vendedor, data · duração, título, pills e resumo de IA. */
export function ConversationCard({ conversation: c, variant = 'row', showSummary = false }: ConversationCardProps) {
  const seller = personById(c.sellerId);
  const processing = c.status === 'processing';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${c.title}, ${seller.name}`}
      onPress={() => router.push(`/conversa/${c.id}`)}
      className="gap-12 rounded-16 border border-border bg-surface p-16"
    >
      <View className="flex-row items-center gap-8">
        <Avatar initials={seller.initials} tone={seller.avatarColor} size="sm" />
        <Text className="font-sans text-12">{seller.name}</Text>
        <Text variant="caption" numberOfLines={1} className="flex-1">
          {/* Na inbox a seção já diz o dia; no card do Início, o dia entra na meta. */}
          {variant === 'row' && ['Hoje', 'Ontem'].includes(formatDay(c.startedAt))
            ? formatTime(c.startedAt)
            : `${formatDay(c.startedAt)} · ${formatTime(c.startedAt)}`}{' '}
          · {formatDuration(c.durationSec)}
        </Text>
      </View>

      <Text className="font-medium text-16" numberOfLines={1}>
        {c.title}
      </Text>

      {processing ? (
        <View className="flex-row">
          <StatusPill label="Processando" icon={LoaderCircle} />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-8">
          <StatusPill label={`${c.score}/${c.maxScore}`} icon={CircleCheck} iconColor="success" />
          <StatusPill label={formatCurrency(c.valueCents)} />
          <StatusPill label={OUTCOME_LABEL[c.outcome]} />
        </View>
      )}

      {showSummary && c.summary ? (
        <Text variant="caption" numberOfLines={2} className="text-text-subtle">
          {c.summary}
        </Text>
      ) : null}
    </PressableScale>
  );
}

export function ConversationCardSkeleton(_: { variant?: 'row' | 'card' }) {
  return (
    <View className="gap-12 rounded-16 border border-border bg-surface p-16">
      <View className="flex-row items-center gap-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-12 w-1/3" />
      </View>
      <Skeleton className="h-20 w-3/4" />
      <View className="flex-row gap-8">
        <Skeleton className="h-24 w-48 rounded-full" />
        <Skeleton className="h-24 w-64 rounded-full" />
        <Skeleton className="h-24 w-64 rounded-full" />
      </View>
    </View>
  );
}
