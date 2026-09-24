import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { AtSign, AudioLines, ChartColumn, House, MessageSquare, type LucideIcon } from 'lucide-react-native';
import { Platform, View } from 'react-native';

import { Glow } from '@/components/Glow';
import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { cn } from '@/lib/utils';
import { colors, sizes } from '@/theme/tokens';

export type TabKey = 'index' | 'conversas' | 'gravar' | 'comentarios' | 'desempenho';

type TabItem = { key: TabKey; label: string; icon: LucideIcon };

export const TABS: readonly TabItem[] = [
  { key: 'index', label: 'Início', icon: House },
  { key: 'conversas', label: 'Conversas', icon: MessageSquare },
  { key: 'gravar', label: 'Gravar', icon: AudioLines },
  { key: 'comentarios', label: 'Comentários', icon: AtSign },
  { key: 'desempenho', label: 'Desempenho', icon: ChartColumn },
];

type TabBarProps = {
  active: TabKey;
  onSelect: (key: TabKey) => void;
  className?: string;
};

/**
 * Tab bar flutuante em vidro (estilo liquid glass da Apple): 64 de altura, pill
 * totalmente arredondada, blur gaussiano real do que passa por trás (BlurView;
 * na web, backdrop-filter), véu claro translúcido, borda clara fina e brilho no topo.
 * Itens circulares de 40; ativo com vidro mais claro. Gravar: círculo primary de 48.
 */
export function TabBar({ active, onSelect, className }: TabBarProps) {
  return (
    <View className={cn('items-center', className)} pointerEvents="box-none">
      <View className="h-64 flex-row items-center gap-8 overflow-hidden rounded-full border border-glass-border px-8">
        <BlurView
          intensity={80}
          tint={Platform.OS === 'ios' ? 'systemUltraThinMaterialDark' : 'dark'}
          blurMethod="dimezisBlurViewSdk31Plus"
          className="absolute bottom-0 left-0 right-0 top-0"
        />
        <View className="absolute bottom-0 left-0 right-0 top-0 bg-glass" />
        <LinearGradient
          pointerEvents="none"
          colors={[colors['glass-sheen'], colors['glass-sheen-0']]}
          locations={[0, 0.5]}
          className="absolute bottom-0 left-0 right-0 top-0"
        />
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          if (tab.key === 'gravar') {
            return (
              <View key={tab.key} className="h-48 w-48 items-center justify-center">
                <Glow className="-bottom-24 -left-24 -right-24 -top-24" />
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                  accessibilityState={{ selected: isActive }}
                  haptic="medium"
                  onPress={() => onSelect(tab.key)}
                  className="h-48 w-48 items-center justify-center rounded-full bg-primary outline-none"
                >
                  <Icon as={tab.icon} size="lg" color="primary-foreground" strokeWidth={2} />
                </PressableScale>
              </View>
            );
          }
          return (
            <PressableScale
              key={tab.key}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              hitSlop={sizes.hitSlop[40]}
              haptic="selection"
              onPress={() => onSelect(tab.key)}
              className={cn('h-40 w-40 items-center justify-center rounded-full outline-none', isActive && 'bg-glass-active')}
            >
              <Icon as={tab.icon} size="md" color={isActive ? 'text' : 'text-muted'} />
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}
