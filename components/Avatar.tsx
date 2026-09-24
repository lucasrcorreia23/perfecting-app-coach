import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Person } from '@/types/domain';

type AvatarTone = Person['avatarColor'] | 'neutral';

const BG: Record<AvatarTone, string> = {
  'avatar-1': 'bg-avatar-1',
  'avatar-2': 'bg-avatar-2',
  'avatar-3': 'bg-avatar-3',
  'avatar-4': 'bg-avatar-4',
  neutral: 'bg-text-muted',
};

const SIZE = {
  sm: 'h-24 w-24',
  md: 'h-32 w-32',
  lg: 'h-40 w-40',
} as const;

type AvatarProps = {
  initials: string;
  tone?: AvatarTone;
  size?: keyof typeof SIZE;
  className?: string;
};

/** Avatar circular com iniciais (24/32/40). Tons pastel dessaturados; clientes em neutro. */
export function Avatar({ initials, tone = 'neutral', size = 'md', className }: AvatarProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      className={cn('items-center justify-center rounded-full', SIZE[size], BG[tone], className)}
    >
      <Text className={cn('font-medium text-background', size === 'lg' ? 'text-14' : 'text-12')}>
        {size === 'sm' ? initials.slice(0, 1) : initials}
      </Text>
    </View>
  );
}
