import { useEffect } from 'react';
import { type ViewProps } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';
import { motion } from '@/theme/tokens';

/** Bloco de carregamento: pulso suave de opacidade em surface-highlight. */
function Skeleton({ className, style, ...props }: ViewProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.4, { duration: motion.duration.slow * 3 }), -1, true));
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      className={cn('rounded-8 bg-surface-highlight', className)}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export { Skeleton };
