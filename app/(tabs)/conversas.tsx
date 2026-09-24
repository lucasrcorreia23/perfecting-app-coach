import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Menu, MessageSquare } from 'lucide-react-native';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConversationCard, ConversationCardSkeleton } from '@/components/ConversationCard';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { useConversations } from '@/hooks/queries';
import { pluralize, sectionFor } from '@/lib/format';
import type { Conversation } from '@/types/domain';
import { sizes, spacing } from '@/theme/tokens';

type Row = { type: 'section'; label: string } | { type: 'item'; conversation: Conversation };

function toRows(list: Conversation[]): Row[] {
  const rows: Row[] = [];
  let current = '';
  list.forEach((c) => {
    const section = sectionFor(c.startedAt);
    if (section !== current) {
      rows.push({ type: 'section', label: section });
      current = section;
    }
    rows.push({ type: 'item', conversation: c });
  });
  return rows;
}

export default function ConversasScreen() {
  const insets = useSafeAreaInsets();
  const { data, isPending } = useConversations();
  const rows = useMemo(() => toRows(data ?? []), [data]);
  const todayCount = (data ?? []).filter((c) => sectionFor(c.startedAt) === 'Hoje').length;
  const bottom = sizes.tabBar + Math.max(insets.bottom, spacing[16]) + spacing[24];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={isPending ? 'Conversas' : pluralize(todayCount, 'conversa', 'conversas')}
        right={<IconButton icon={Menu} label="Filtros e ordenação" variant="ghost" iconColor="primary-foreground" />}
      />
      {isPending ? (
        <View className="gap-12 px-16">
          <SectionLabel className="px-0 pb-0 pt-0">Hoje</SectionLabel>
          <ConversationCardSkeleton />
          <ConversationCardSkeleton />
        </View>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhuma conversa ainda"
          description="Grave sua primeira conversa de venda pelo botão central e ela aparece aqui."
          action={{ label: 'Gravar agora', onPress: () => router.navigate('/gravar') }}
        />
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(r) => (r.type === 'section' ? `s-${r.label}` : r.conversation.id)}
          getItemType={(r) => r.type}
          contentContainerStyle={{ paddingBottom: bottom }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            item.type === 'section' ? (
              <SectionLabel className={index === 0 ? 'pt-0' : undefined}>{item.label}</SectionLabel>
            ) : (
              <View className="px-16 pb-12">
                <ConversationCard conversation={item.conversation} />
              </View>
            )
          }
        />
      )}
    </View>
  );
}
