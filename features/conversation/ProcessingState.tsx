import { Check, LoaderCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { PROCESSING_MS } from '@/api';
import { COACH_NAME, motion } from '@/theme/tokens';

const STEPS = ['Enviando o áudio', 'Transcrevendo a conversa', `${COACH_NAME} analisando as etapas`];

function Spinner() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.set(withRepeat(withTiming(360, { duration: motion.duration.slow * 3, easing: Easing.linear }), -1));
    return () => cancelAnimation(rotation);
  }, [rotation]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get()}deg` }] }));
  return (
    <Animated.View style={style}>
      <Icon as={LoaderCircle} size="sm" color="text" />
    </Animated.View>
  );
}

/** Estado "Processando" de uma conversa recém-gravada. */
export function ProcessingState() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), PROCESSING_MS / STEPS.length);
    return () => clearInterval(id);
  }, []);

  return (
    <View className="gap-24 px-16 pt-24">
      <View className="gap-16 rounded-16 border border-border bg-surface p-16">
        <Text variant="label">Processando</Text>
        {STEPS.map((label, i) => (
          <View key={label} className="h-24 flex-row items-center gap-12">
            {i < step ? <Icon as={Check} size="sm" color="success" /> : i === step ? <Spinner /> : <View className="h-16 w-16 rounded-full border border-border-strong" />}
            <Text variant="body" className={i <= step ? 'text-text' : 'text-text-subtle'}>
              {label}
            </Text>
          </View>
        ))}
      </View>
      <View className="gap-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-5/6" />
      </View>
    </View>
  );
}
