import { Platform } from 'react-native';
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

function useNativeKeyboardInset(extra: number) {
  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();
  return useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.value, insets.bottom) + extra,
  }));
}

function useWebKeyboardInset(extra: number) {
  const insets = useSafeAreaInsets();
  return { paddingBottom: insets.bottom + extra };
}

/**
 * Padding inferior que acompanha o teclado (iOS e Android, via Reanimated).
 * Use em Animated.View de compositores fixos na base da tela.
 */
export const useKeyboardInset: (extra?: number) => object =
  Platform.OS === 'web'
    ? (extra = spacing[12]) => useWebKeyboardInset(extra)
    : (extra = spacing[12]) => useNativeKeyboardInset(extra);
