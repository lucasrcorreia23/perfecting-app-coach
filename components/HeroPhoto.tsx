import { LinearGradient } from 'expo-linear-gradient';
import { Image, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { colors } from '@/theme/tokens';

/**
 * Foto do hero em tela cheia: prédio contra o céu em brasa do fim do dia (fim de
 * expediente). Foto de Emanuel Haas no Unsplash (unsplash.com/photos/8lACNRSjL-A,
 * Unsplash License), espelhada na horizontal.
 * - Véu fixo: escurece o topo (logo e avatar) e a base (tab bar).
 * - Véu de leitura: escurece a metade de baixo para a headline e os cards;
 *   entra com `reveal` (0 = descanso de tela, 1 = informações visíveis).
 */
export function HeroPhoto({ height, reveal }: { height: number; reveal: SharedValue<number> }) {
  const readingVeil = useAnimatedStyle(() => ({ opacity: reveal.get() }));

  return (
    <View style={{ height }} className="w-full bg-background">
      <Image
        source={require('@/assets/images/hero-ceu-brasa.jpg')}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessible={false}
        style={{ position: 'absolute', width: '100%', height }}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[colors['veil-50'], colors['veil-0'], colors['veil-0'], colors['veil-50']]}
        locations={[0, 0.16, 0.78, 1]}
        className="absolute bottom-0 left-0 right-0 top-0"
      />
      <Animated.View pointerEvents="none" style={readingVeil} className="absolute bottom-0 left-0 right-0 top-0">
        <LinearGradient
          colors={[colors['veil-0'], colors['veil-90'], colors.background]}
          locations={[0.46, 0.66, 0.88]}
          className="absolute bottom-0 left-0 right-0 top-0"
        />
      </Animated.View>
    </View>
  );
}
