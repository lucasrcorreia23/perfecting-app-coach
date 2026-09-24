import { View } from 'react-native';

import { Text, type TextVariant } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Headline em Anton com um trecho em bloco primary (como o "ANYWHERE" da referência).
 * Marque o destaque com *asteriscos*: "Coach em\n*qualquer lugar*".
 */
export function HighlightText({
  children,
  variant = 'display-lg',
  align = 'left',
  lineClassName,
}: {
  children: string;
  variant?: TextVariant;
  align?: 'left' | 'center';
  lineClassName?: string;
}) {
  const lines = children.split('\n');
  return (
    <View className={cn('gap-4', align === 'center' ? 'items-center' : 'items-start')}>
      {lines.map((line, i) => {
        const highlighted = line.startsWith('*') && line.endsWith('*');
        const text = highlighted ? line.slice(1, -1) : line;
        return highlighted ? (
          <View key={i} className="bg-primary px-8">
            <Text variant={variant} className={cn('text-primary-foreground', lineClassName)}>
              {text}
            </Text>
          </View>
        ) : (
          <Text key={i} variant={variant} className={cn(align === 'center' && 'text-center', lineClassName)}>
            {text}
          </Text>
        );
      })}
    </View>
  );
}
