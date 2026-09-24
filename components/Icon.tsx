import type { LucideIcon } from 'lucide-react-native';

import { colors, sizes, type ColorToken } from '@/theme/tokens';

export type IconSize = keyof typeof sizes.icon;

type IconProps = {
  as: LucideIcon;
  size?: IconSize;
  color?: ColorToken;
  strokeWidth?: 1.5 | 2;
};

/** Ícone lucide preso aos tokens de tamanho (16/20/24) e cor. */
export function Icon({ as: Component, size = 'md', color = 'text', strokeWidth = 1.5 }: IconProps) {
  return <Component size={sizes.icon[size]} color={colors[color]} strokeWidth={strokeWidth} />;
}
