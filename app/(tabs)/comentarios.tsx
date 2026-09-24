import { FlashList } from '@shopify/flash-list';
import { AtSign, CheckCheck } from 'lucide-react-native';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { MentionItem, MentionItemSkeleton } from '@/components/MentionItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionLabel';
import { useConversations, useMentions } from '@/hooks/queries';
import { pluralize, sectionFor } from '@/lib/format';
import type { Mention } from '@/types/domain';
import { sizes, spacing } from '@/theme/tokens';

type Row = { type: 'section'; label: string } | { type: 'item'; mention: Mention };

export default function ComentariosScreen() {
  const insets = useSafeAreaInsets();
  const mentions = useMentions();
  const conversations = useConversations();
  const unread = (mentions.data ?? []).filter((m) => !m.read).length;

  const rows = useMemo(() => {
    const out: Row[] = [];
    let current = '';
    const list = mentions.data ?? [];
    list.forEach((m) => {
      const section = sectionFor(m.createdAt);
      if (section !== current) {
        out.push({ type: 'section', label: section });
        current = section;
      }
      out.push({ type: 'item', mention: m });
    });
    return out;
  }, [mentions.data]);

  const bottom = sizes.tabBar + Math.max(insets.bottom, spacing[16]) + spacing[24];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={mentions.isPending ? 'Menções' : unread > 0 ? pluralize(unread, 'nova menção', 'novas menções') : 'Menções'}
        right={<IconButton icon={CheckCheck} label="Marcar todas como lidas" variant="ghost" iconColor="primary-foreground" />}
      />
      {mentions.isPending ? (
        <View className="gap-12 px-16">
          <SectionLabel className="px-0 pb-0 pt-0">Hoje</SectionLabel>
          <MentionItemSkeleton />
          <MentionItemSkeleton />
        </View>
      ) : rows.length === 0 ? (
        <EmptyState icon={AtSign} title="Nenhuma menção" description="Quando alguém mencionar você em um comentário, ele aparece aqui." />
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(r) => (r.type === 'section' ? `s-${r.label}` : r.mention.id)}
          getItemType={(r) => r.type}
          contentContainerStyle={{ paddingBottom: bottom }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>
            item.type === 'section' ? (
              <SectionLabel className={index === 0 ? 'pt-0' : undefined}>{item.label}</SectionLabel>
            ) : (
              <View className="px-16 pb-12">
                <MentionItem
                  mention={item.mention}
                  conversation={conversations.data?.find((c) => c.id === item.mention.conversationId)}
                />
              </View>
            )
          }
        />
      )}
    </View>
  );
}
