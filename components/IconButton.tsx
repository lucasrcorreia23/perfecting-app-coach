import type { LucideIcon } from 'lucide-react-native';

import { Icon, type IconSize } from '@/components/Icon';
import { PressableScale, type PressableScaleProps } from '@/components/PressableScale';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sizes, type ColorToken } from '@/theme/tokens';

type Size = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<Size, IconSize> = { sm: 'sm', md: 'md', lg: 'lg' };
const HIT_SLOP: Record<Size, number> = {
  sm: sizes.hitSlop[32],
  md: sizes.hitSlop[40],
  lg: sizes.hitSlop[48],
};

type IconButtonProps = Omit<PressableScaleProps, 'children'> & {
  icon: LucideIcon;
  /** Obrigatório: rótulo de acessibilidade. */
  label: string;
  size?: Size;
  /** `circle` para ações; `square` (raio 12) só para voltar. */
  shape?: 'circle' | 'square';
  variant?: 'secondary' | 'primary' | 'ghost' | 'outline';
  iconColor?: ColorToken;
};

/** Botão de ícone circular (32/40/48) com área de toque >= 44 via hitSlop. */
export function IconButton({
  icon,
  label,
  size = 'md',
  shape = 'circle',
  variant = 'secondary',
  iconColor,
  className,
  ...props
}: IconButtonProps) {
  const color = iconColor ?? (variant === 'primary' ? 'primary-foreground' : 'text');
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP[size]}
      className={cn(buttonVariants({ variant, shape, size }), className)}
      {...props}
    >
      <Icon as={icon} size={ICON_SIZE[size]} color={color} />
    </PressableScale>
  );
}
