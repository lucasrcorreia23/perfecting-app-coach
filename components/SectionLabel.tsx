import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Label de seção em caixa alta ("HOJE"), com divisor opcional abaixo. */
export function SectionLabel({ children, divider = false, className }: { children: string; divider?: boolean; className?: string }) {
  return (
    <View className={cn('px-16 pb-12 pt-24', divider && 'border-b border-border', className)}>
      <Text variant="label">{children}</Text>
    </View>
  );
}
