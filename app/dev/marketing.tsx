import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import { BatteryFull, Signal, Wifi } from 'lucide-react-native';
import { createElement } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { EmptyState } from '@/components/EmptyState';
import { HighlightText } from '@/components/HighlightText';
import { Text } from '@/components/ui/text';
import { SCENES } from '@/features/marketing/scenes';
import { colors, marketing as m, sizes } from '@/theme/tokens';

const SCREEN_W = sizes.frameWidth * m.scale;
const SCREEN_H = sizes.frameHeight * m.scale;
const APP_H = sizes.frameHeight - m.statusBar;

/** Tela do app dentro da moldura: status bar fake + iframe da rota demo, escalados. */
function Device({ route }: { route: string }) {
  return (
    <View
      className="border border-border-strong bg-surface-highlight"
      style={{ width: SCREEN_W + m.bezel * 2, height: SCREEN_H + m.bezel * 2, padding: m.bezel, borderRadius: m.deviceRadius }}
    >
      <View className="flex-1 overflow-hidden bg-background" style={{ borderRadius: m.screenRadius }}>
        <View style={{ width: sizes.frameWidth, height: sizes.frameHeight, transform: [{ scale: m.scale }], transformOrigin: 'top left' }}>
          <View className="flex-row items-center justify-between px-32" style={{ height: m.statusBar }}>
            <Text className="font-medium text-16">9:41</Text>
            <View className="flex-row items-center gap-4">
              <Icon as={Signal} size="sm" strokeWidth={2} />
              <Icon as={Wifi} size="sm" strokeWidth={2} />
              <Icon as={BatteryFull} size="md" strokeWidth={2} />
            </View>
          </View>
          {createElement('iframe', {
            src: route,
            title: route,
            style: { width: sizes.frameWidth, height: APP_H, border: 0, display: 'block', background: colors.background },
          })}
        </View>
      </View>
    </View>
  );
}

/** Uma cena no canvas 430x932 (export 1290x2796 @3x): headline em Anton + iPhone. */
function Canvas({ headline, route }: { headline: string; route: string }) {
  return (
    <View style={{ width: m.canvas.width, height: m.canvas.height }} className="items-center overflow-hidden">
      <LinearGradient
        colors={[colors.background, colors['surface-elevated'], colors['text-subtle']]}
        locations={[0, 0.45, 1]}
        className="absolute bottom-0 left-0 right-0 top-0"
      />
      <View className="items-center px-24 pb-40 pt-64">
        <HighlightText align="center" lineClassName="leading-56">
          {headline}
        </HighlightText>
      </View>
      <Device route={route} />
    </View>
  );
}

export default function MarketingScreen() {
  const { scene } = useLocalSearchParams<{ scene?: string }>();

  if (Platform.OS !== 'web') {
    return <EmptyState icon={Signal} title="Só na web" description="A moldura de marketing usa iframes e roda apenas na versão web." />;
  }

  const one = SCENES.find((s) => s.key === scene);
  if (one) return <Canvas headline={one.headline} route={one.route} />;

  return (
    <ScrollView contentContainerClassName="flex-row flex-wrap gap-24 p-24">
      {SCENES.map((s) => (
        <Link key={s.key} href={{ pathname: '/dev/marketing', params: { scene: s.key } }} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={`Abrir cena ${s.key}`}>
            <Canvas headline={s.headline} route={s.route} />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
