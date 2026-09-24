import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenGradient } from '@/components/ScreenGradient';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { colors, spacing } from '@/theme/tokens';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /**
   * `accent`: bloco em primary com degradê suave e texto escuro (como o header amarelo da inbox da referência).
   * `neutral`: degradê surface-elevated → background.
   */
  variant?: 'accent' | 'neutral';
};

/** Header das abas principais: título/contador em Anton e ação à direita. */
export function ScreenHeader({ title, subtitle, right, variant = 'accent' }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const accent = variant === 'accent';

  // Status bar escura sobre o bloco primary enquanto a tela está em foco.
  useFocusEffect(
    useCallback(() => {
      if (!accent) return;
      setStatusBarStyle('dark');
      return () => setStatusBarStyle('light');
    }, [accent]),
  );

  return (
    <View
      style={{ paddingTop: insets.top + spacing[24] }}
      className={cn('overflow-hidden px-16', accent ? 'bg-primary pb-48' : 'pb-24')}
    >
      {accent ? (
        <LinearGradient
          pointerEvents="none"
          colors={[colors.primary, colors['primary-highlight']]}
          locations={[0.2, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 top-0"
        />
      ) : (
        <ScreenGradient className="h-full" />
      )}
      <View className="h-40 flex-row items-center justify-between">
        <Text variant="display-md" numberOfLines={1} className={cn('flex-1', accent && 'text-primary-foreground')}>
          {title}
        </Text>
        {right}
      </View>
      {/* Início do painel escuro com cantos arredondados sobre o bloco (como na referência). */}
      {accent ? <View className="absolute bottom-0 left-0 right-0 h-24 rounded-t-24 bg-background" /> : null}
      {subtitle ? (
        <Text variant="caption" className={cn('pt-4', accent && 'text-primary-foreground')}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
