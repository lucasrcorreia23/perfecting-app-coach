import Svg, { Path } from 'react-native-svg';

import { LOGO_VIEWBOX, MARK_PATHS, MARK_VIEWBOX, WORDMARK_PATHS } from '@/components/logo-paths';
import { colors, type ColorToken } from '@/theme/tokens';

type LogoProps = {
  /** Altura em pt. A largura segue a proporção do arquivo original. */
  height?: 16 | 20 | 24 | 32;
  variant?: 'full' | 'mark';
  /** Monocromático por padrão, para respeitar a regra de cor do app. */
  color?: ColorToken;
};

export function Logo({ height = 24, variant = 'full', color = 'text' }: LogoProps) {
  const box = variant === 'full' ? LOGO_VIEWBOX : MARK_VIEWBOX;
  const paths = variant === 'full' ? [...MARK_PATHS, ...WORDMARK_PATHS] : MARK_PATHS;
  const fill = colors[color];

  return (
    <Svg
      width={(height * box.width) / box.height}
      height={height}
      viewBox={`0 0 ${box.width} ${box.height}`}
      accessibilityRole="image"
      accessibilityLabel="Perfecting"
    >
      {paths.map((p) => (
        <Path key={p.d.slice(0, 24)} d={p.d} fill={fill} fillRule={p.evenodd ? 'evenodd' : 'nonzero'} />
      ))}
    </Svg>
  );
}
