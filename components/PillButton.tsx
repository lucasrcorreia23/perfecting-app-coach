import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { PressableScale, type PressableScaleProps } from '@/components/PressableScale';
import { buttonTextVariants, buttonVariants } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { sizes } from '@/theme/tokens';

type PillButtonProps = Omit<PressableScaleProps, 'children'> & {
  label: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  /**
   * outline: pill com borda neutra (padrão).
   * accent: ação principal da tela ("Concluir") — borda e marcador em primary.
   * primary: preenchido em primary (uso raro).
   * secondary/ghost: ações secundárias.
   */
  variant?: 'outline' | 'accent' | 'primary' | 'secondary' | 'ghost';
};

/** Botão em pill (32/40/48). O "Concluir" da gravação usa variant="accent" com marcador quadrado. */
export function PillButton({
  label,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'outline',
  className,
  ...props
}: PillButtonProps) {
  const isAccent = variant === 'accent';
  const base = isAccent ? 'outline' : variant;
  const iconNode = icon ? (
    <Icon as={icon} size="sm" color={isAccent ? 'primary' : variant === 'primary' ? 'primary-foreground' : 'text-muted'} />
  ) : null;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size === 'sm' ? sizes.hitSlop[32] : size === 'md' ? sizes.hitSlop[40] : 0}
      haptic={isAccent || variant === 'primary' ? 'light' : 'none'}
      className={cn(buttonVariants({ variant: base, shape: 'pill', size }), isAccent && 'border-primary', className)}
      {...props}
    >
      {iconPosition === 'left' && iconNode}
      <Text className={cn(buttonTextVariants({ variant: base }))}>{label}</Text>
      {iconPosition === 'right' && iconNode}
    </PressableScale>
  );
}

/** Marcador quadrado usado no "Concluir" (como o stop da referência). */
export function StopMarker() {
  return <View className="h-12 w-12 rounded-none bg-primary" />;
}
