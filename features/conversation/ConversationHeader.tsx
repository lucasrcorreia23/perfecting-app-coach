import { router } from 'expo-router';
import { ChevronLeft, CircleCheck, Ellipsis, LoaderCircle } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { StatusPill } from '@/components/StatusPill';
import { Text } from '@/components/ui/text';
import { formatCurrency, formatDayTime, OUTCOME_LABEL } from '@/lib/format';
import { personById } from '@/mocks/people';
import type { Conversation } from '@/types/domain';
import { spacing } from '@/theme/tokens';

/** Header centralizado: voltar (quadrado), vendedor · data, título e pills. */
export function ConversationHeader({ conversation: c }: { conversation: Conversation }) {
  const insets = useSafeAreaInsets();
  const seller = personById(c.sellerId);
  const processing = c.status === 'processing';

  return (
    <View style={{ paddingTop: insets.top + spacing[16] }} className="flex-row items-start gap-8 px-16 pb-16">
      <IconButton
        icon={ChevronLeft}
        label="Voltar"
        shape="square"
        onPress={() => (router.canGoBack() ? router.back() : router.navigate('/conversas'))}
      />
      <View className="flex-1 items-center gap-4">
        <Text variant="caption" numberOfLines={1}>
          <Text className="font-sans text-12 text-text">{seller.name}</Text> {formatDayTime(c.startedAt)}
        </Text>
        <Text variant="title" numberOfLines={1} className="text-center">
          {c.title}
        </Text>
        <View className="flex-row flex-wrap justify-center gap-8 pt-4">
          {processing ? (
            <StatusPill label="Processando" icon={LoaderCircle} />
          ) : (
            <>
              <StatusPill label={`${c.score}/${c.maxScore}`} icon={CircleCheck} iconColor="success" />
              <StatusPill label={OUTCOME_LABEL[c.outcome]} />
              <StatusPill label={formatCurrency(c.valueCents)} />
            </>
          )}
        </View>
      </View>
      <IconButton icon={Ellipsis} label="Mais opções" variant="ghost" />
    </View>
  );
}
