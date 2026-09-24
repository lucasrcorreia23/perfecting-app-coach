import { ClipboardCheck, FileText, MessageSquare, Sparkles, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import { COACH_NAME, motion } from '@/theme/tokens';

import type { DetailTab } from './context';

const TABS: { key: DetailTab; label: string; icon: LucideIcon }[] = [
  { key: 'transcricao', label: 'Transcrição', icon: FileText },
  { key: 'feedback', label: 'Feedback', icon: ClipboardCheck },
  { key: 'coach', label: COACH_NAME, icon: Sparkles },
  { key: 'comentarios', label: 'Comentários', icon: MessageSquare },
];

type Layout = { x: number; width: number };

/** Abas com ícone e texto; ativa em branco com sublinhado fino (1) em primary, animado. */
export function DetailTabs({ value, onChange, counts }: { value: DetailTab; onChange: (t: DetailTab) => void; counts?: Partial<Record<DetailTab, number>> }) {
  const [layouts, setLayouts] = useState<Partial<Record<DetailTab, Layout>>>({});
  const x = useSharedValue(0);
  const width = useSharedValue(0);

  useEffect(() => {
    const l = layouts[value];
    if (!l) return;
    const first = width.get() === 0;
    x.set(first ? l.x : withTiming(l.x, { duration: motion.duration.base }));
    width.set(first ? l.width : withTiming(l.width, { duration: motion.duration.base }));
  }, [layouts, value, x, width]);

  const underline = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }], width: width.get() }));

  return (
    <View className="border-b border-border">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-20 px-16">
        {TABS.map((t) => {
          const active = t.key === value;
          const count = counts?.[t.key];
          return (
            <Pressable
              key={t.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.label}
              onLayout={(e) => {
                const { x: lx, width: lw } = e.nativeEvent.layout;
                setLayouts((prev) => ({ ...prev, [t.key]: { x: lx, width: lw } }));
              }}
              onPress={() => {
                if (!active) haptics.selection();
                onChange(t.key);
              }}
              className="h-48 flex-row items-center gap-8"
            >
              <Icon as={t.icon} size="sm" color={active ? 'text' : 'text-subtle'} />
              <Text className={active ? 'font-medium text-14 text-text' : 'font-medium text-14 text-text-subtle'}>
                {t.label}
              </Text>
              {count ? (
                <Text className="font-sans text-12 text-text-subtle" style={{ fontVariant: ['tabular-nums'] }}>
                  {count}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
        <Animated.View style={underline} className="absolute bottom-0 left-0 h-px bg-primary" />
      </ScrollView>
    </View>
  );
}
