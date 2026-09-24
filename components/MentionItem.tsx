import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { MentionText } from '@/components/MentionText';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { formatClock, formatDayTime } from '@/lib/format';
import { personById } from '@/mocks/people';
import type { Conversation, Mention } from '@/types/domain';

/** Menção recebida: autor, conversa de origem, trecho citado e comentário. */
export function MentionItem({ mention: m, conversation }: { mention: Mention; conversation?: Conversation }) {
  const author = personById(m.authorId);
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${author.name} mencionou você: ${m.text}`}
      onPress={() =>
        router.push({
          pathname: '/conversa/[id]',
          params: { id: m.conversationId, tab: 'comentarios', from: String(m.startSec), to: String(m.endSec) },
        })
      }
      className="gap-12 rounded-16 border border-border bg-surface p-16"
    >
      <View className="flex-row items-center gap-8">
        <Avatar initials={author.initials} tone={author.avatarColor} size="sm" />
        <Text className="font-sans text-12">{author.name}</Text>
        <Text variant="caption" numberOfLines={1} className="flex-1">
          {formatDayTime(m.createdAt)}
        </Text>
        {m.read ? null : <View accessibilityLabel="Não lida" className="h-8 w-8 rounded-full bg-text" />}
      </View>
      <MentionText text={m.text} />
      <View className="overflow-hidden rounded-12 bg-surface-elevated px-12 py-8">
        <View className="absolute bottom-0 left-0 top-0 w-4 bg-primary" />
        <Text variant="caption" numberOfLines={1}>
          <Text className="font-sans text-12 text-text-muted" style={{ fontVariant: ['tabular-nums'] }}>
            {formatClock(m.startSec)}
          </Text>{' '}
          {m.excerpt}
        </Text>
      </View>
      {conversation ? (
        <Text variant="caption" numberOfLines={1} className="text-text-subtle">
          em {conversation.title}
        </Text>
      ) : null}
    </PressableScale>
  );
}

export function MentionItemSkeleton() {
  return (
    <View className="gap-8 rounded-16 border border-border bg-surface p-16">
      <View className="flex-row items-center gap-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-12 w-1/3" />
      </View>
      <Skeleton className="h-20 w-3/4" />
      <Skeleton className="h-64 w-full rounded-12" />
    </View>
  );
}
