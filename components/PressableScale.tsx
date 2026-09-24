import { cssInterop } from 'nativewind';
import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptics, type HapticKind } from '@/lib/haptics';
import { motion } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
cssInterop(AnimatedPressable, { className: 'style' });

export type PressableScaleProps = PressableProps & {
  className?: string;
  /** Haptic disparado no toque. Padrão: nenhum. */
  haptic?: HapticKind;
};

/** Feedback de toque com leve escala (0.97), usado por todos os botões. */
export function PressableScale({ haptic = 'none', onPressIn, onPressOut, onPress, style, ...props }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...props}
      style={[animatedStyle, style as object]}
      onPressIn={(e) => {
        scale.set(withTiming(motion.pressScale, { duration: motion.duration.fast }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: motion.duration.base }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(e);
      }}
    />
  );
}
