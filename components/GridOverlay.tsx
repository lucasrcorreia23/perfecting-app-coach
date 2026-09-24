import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { useDevStore } from '@/stores/dev';
import { colors, sizes } from '@/theme/tokens';

/**
 * Overlay de grid 4/8 para conferência pixel perfect.
 * Linhas finas a cada 4pt, mais fortes a cada 8pt e faixas das margens laterais (16).
 * Ative com ?grid=1 (web) ou pelo botão flutuante em /dev.
 */
export function GridOverlay() {
  const visible = useDevStore((s) => s.gridVisible);
  const { width, height } = useWindowDimensions();
  if (!visible) return null;

  const margin = sizes.screenMargin;
  const frame = Math.min(width, sizes.frameWidth);

  return (
    <View pointerEvents="none" className="absolute bottom-0 left-0 right-0 top-0 items-center">
      <Svg width={frame} height={height}>
        <Defs>
          <Pattern id="grid" width={8} height={8} patternUnits="userSpaceOnUse">
            <Line x1={4} y1={0} x2={4} y2={8} stroke={colors['grid-4']} strokeWidth={1} />
            <Line x1={0} y1={4} x2={8} y2={4} stroke={colors['grid-4']} strokeWidth={1} />
            <Line x1={0} y1={0} x2={0} y2={8} stroke={colors['grid-8']} strokeWidth={1} />
            <Line x1={0} y1={0} x2={8} y2={0} stroke={colors['grid-8']} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={frame} height={height} fill="url(#grid)" />
        <Rect x={0} y={0} width={margin} height={height} fill={colors['grid-margin']} />
        <Rect x={frame - margin} y={0} width={margin} height={height} fill={colors['grid-margin']} />
      </Svg>
    </View>
  );
}
