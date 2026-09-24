import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { ColorToken } from '@/theme/tokens';

type StatusPillProps = {
  label: string;
  icon?: LucideIcon;
  /** Cor do ícone (ex: success no check da nota). O texto é sempre neutro. */
  iconColor?: ColorToken;
  className?: string;
};

/** Pill de status: altura 24, totalmente arredondada, surface-elevated. */
export function StatusPill({ label, icon, iconColor = 'text-muted', className }: StatusPillProps) {
  return (
    <View className={cn('h-24 flex-row items-center gap-4 rounded-full bg-surface-elevated px-8', className)}>
      <Text className="font-sans text-12 text-text">{label}</Text>
      {icon ? <Icon as={icon} size="sm" color={iconColor} /> : null}
    </View>
  );
}
