import { router, useGlobalSearchParams } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { ConversationCard, ConversationCardSkeleton } from '@/components/ConversationCard';
import { HeroPhoto } from '@/components/HeroPhoto';
import { HighlightText } from '@/components/HighlightText';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { PressableScale } from '@/components/PressableScale';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useConversations, useDaySummary } from '@/hooks/queries';
import { useIdleReveal } from '@/hooks/useIdleReveal';
import { useDemo } from '@/lib/demo';
import { formatDecimal } from '@/lib/format';
import { CURRENT_USER_ID, personById } from '@/mocks/people';
import { COACH_NAME, motion, sizes, spacing } from '@/theme/tokens';

function StatCard({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <View className="flex-1 gap-4 rounded-16 border border-border bg-surface/80 p-12">
      <Text variant="caption" numberOfLines={1}>
        {label}
      </Text>
      {loading ? <Skeleton className="h-32 w-1/2" /> : <Text variant="display-sm">{value}</Text>}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const summary = useDaySummary();
  const conversations = useConversations();
  const me = personById(CURRENT_USER_ID);
  const firstName = me.name.split(' ')[0];

  // Descanso de tela: só foto, logo, avatar e tab bar; interação revela o resto.
  // Demo: ?demo=1 mostra as informações; ?demo=1&idle=1 mostra o descanso.
  const demo = useDemo();
  const { idle: idleParam } = useGlobalSearchParams<{ idle?: string }>();
  const forceIdle = demo && idleParam === '1';
  const { idle, wake, setCanSleep } = useIdleReveal({ disabled: demo && !forceIdle });
  const showInfo = forceIdle ? false : !idle;

  const reveal = useSharedValue(showInfo ? 1 : 0);
  useEffect(() => {
    reveal.set(withTiming(showInfo ? 1 : 0, { duration: showInfo ? motion.duration.slow : motion.duration.slow * 2 }));
  }, [reveal, showInfo]);
  const infoStyle = useAnimatedStyle(() => ({
    opacity: reveal.get(),
    transform: [{ translateY: (1 - reveal.get()) * spacing[16] }],
  }));

  // Hero em tela cheia: a dobra termina logo acima da tab bar flutuante.
  const heroHeight = height;
  const tabBarSpace = sizes.tabBar + Math.max(insets.bottom, spacing[16]) + spacing[16];

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      scrollEnabled={showInfo}
      onTouchStart={forceIdle ? undefined : wake}
      onScrollBeginDrag={forceIdle ? undefined : wake}
      onScroll={(e) => setCanSleep(e.nativeEvent.contentOffset.y < spacing[8])}
      scrollEventThrottle={64}
    >
      <View style={{ height: heroHeight }}>
        <View className="absolute bottom-0 left-0 right-0 top-0">
          <HeroPhoto height={heroHeight} reveal={reveal} />
        </View>

        <View style={{ paddingTop: insets.top + spacing[16] }} className="flex-row items-center justify-between px-16">
          <Logo height={20} />
          <Avatar initials={me.initials} tone={me.avatarColor} size="md" />
        </View>

        <Animated.View
          pointerEvents={showInfo ? 'auto' : 'none'}
          accessibilityElementsHidden={!showInfo}
          importantForAccessibility={showInfo ? 'auto' : 'no-hide-descendants'}
          className="flex-1 justify-end gap-24 px-16"
          style={[{ paddingBottom: tabBarSpace }, infoStyle]}
        >
          <View className="gap-12">
            <Text variant="label">Olá, {firstName}</Text>
            <HighlightText>{'Coach em\n*qualquer lugar*'}</HighlightText>
            <Text variant="body" className="text-text-muted">
              Grave conversas de venda na loja ou na visita e receba o feedback do {COACH_NAME} em minutos.
            </Text>
          </View>

          <View className="flex-row gap-8">
            <StatCard label="Gravadas hoje" value={String(summary.data?.recordedToday ?? 0)} loading={summary.isPending} />
            <StatCard
              label="Nota média"
              value={summary.data ? formatDecimal(summary.data.averageScore) : ''}
              loading={summary.isPending}
            />
            <StatCard
              label="Meta semanal"
              value={summary.data ? `${summary.data.weeklyGoal.done}/${summary.data.weeklyGoal.target}` : ''}
              loading={summary.isPending}
            />
          </View>
        </Animated.View>
      </View>

      <Animated.View className="gap-12 px-16" style={[{ paddingBottom: tabBarSpace }, infoStyle]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Ver todas as conversas"
          onPress={() => router.navigate('/conversas')}
          className="h-40 flex-row items-center justify-between"
        >
          <Text variant="label">Últimas conversas</Text>
          <View className="flex-row items-center gap-4">
            <Text variant="caption">Ver todas</Text>
            <Icon as={ChevronRight} size="sm" color="text-muted" />
          </View>
        </PressableScale>
        {conversations.isPending ? (
          <>
            <ConversationCardSkeleton variant="card" />
            <ConversationCardSkeleton variant="card" />
          </>
        ) : (
          conversations.data?.slice(0, 2).map((c) => <ConversationCard key={c.id} conversation={c} variant="card" />)
        )}
      </Animated.View>
    </ScrollView>
  );
}
