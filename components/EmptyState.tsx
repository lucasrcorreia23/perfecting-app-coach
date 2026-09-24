import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { PillButton } from '@/components/PillButton';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onPress: () => void };
  className?: string;
};

/** Estado vazio desenhado: ícone em círculo, título, descrição e ação opcional. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <View className={cn('items-center gap-16 px-32 py-48', className)}>
      <View className="h-48 w-48 items-center justify-center rounded-full border border-border bg-surface-elevated">
        <Icon as={icon} size="lg" color="text-muted" />
      </View>
      <View className="items-center gap-4">
        <Text variant="title" className="text-center">
          {title}
        </Text>
        <Text variant="caption" className="text-center">
          {description}
        </Text>
      </View>
      {action ? <PillButton label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}
