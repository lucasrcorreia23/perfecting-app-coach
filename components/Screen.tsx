import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenGradient } from '@/components/ScreenGradient';
import { cn } from '@/lib/utils';
import { spacing } from '@/theme/tokens';

type ScreenProps = ScrollViewProps & {
  /** Degradê neutro no topo (padrão: ligado). */
  gradient?: boolean;
  /** Espaço extra no fim para a tab bar flutuante. */
  tabBarInset?: boolean;
  contentClassName?: string;
};

/** Container de tela: safe area, margem lateral 16 e scroll. */
export function Screen({ gradient = true, tabBarInset = false, contentClassName, children, ...props }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottom = insets.bottom + (tabBarInset ? spacing[64] + spacing[32] : spacing[24]);

  return (
    <View className="flex-1 bg-background">
      {gradient ? <ScreenGradient /> : null}
      <ScrollView
        {...props}
        contentContainerStyle={{ paddingTop: insets.top + spacing[16], paddingBottom: bottom }}
        contentContainerClassName={cn('gap-24 px-16', contentClassName)}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
