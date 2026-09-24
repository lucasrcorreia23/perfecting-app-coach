import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Visibility } from '@/types/domain';
import { motion, spacing } from '@/theme/tokens';

/** Toggle Público/Privado em pill: trilho 40x24 com knob de 16. */
export function VisibilityToggle({ value, onChange }: { value: Visibility; onChange: (v: Visibility) => void }) {
  const isPublic = value === 'public';
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(isPublic ? spacing[16] : 0, { duration: motion.duration.base }) }],
  }));

  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityState={{ checked: isPublic }}
      accessibilityLabel="Visibilidade do comentário"
      haptic="selection"
      hitSlop={spacing[4]}
      onPress={() => onChange(isPublic ? 'private' : 'public')}
      className="h-40 flex-row items-center gap-8 rounded-full bg-surface-highlight pl-8 pr-12"
    >
      <View className={cn('h-24 w-40 justify-center rounded-full px-4', isPublic ? 'bg-text-subtle' : 'bg-border-strong')}>
        <Animated.View style={knob} className="h-16 w-16 rounded-full bg-text" />
      </View>
      <Text className="font-sans text-12">{isPublic ? 'Público' : 'Privado'}</Text>
    </PressableScale>
  );
}
