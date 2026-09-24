import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBar, type TabKey } from '@/components/TabBar';
import { colors, spacing } from '@/theme/tokens';

/** Abas principais com a tab bar flutuante. Na tela de gravação a tab bar some. */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background }, animation: 'fade' }}
      tabBar={({ state, navigation }) => {
        const active = state.routes[state.index]?.name as TabKey;
        if (active === 'gravar') return null;
        return (
          <View
            pointerEvents="box-none"
            className="absolute bottom-0 left-0 right-0"
            style={{ paddingBottom: Math.max(insets.bottom, spacing[16]) }}
          >
            <TabBar active={active} onSelect={(key) => navigation.navigate(key)} />
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="conversas" options={{ title: 'Conversas' }} />
      <Tabs.Screen name="gravar" options={{ title: 'Gravar' }} />
      <Tabs.Screen name="comentarios" options={{ title: 'Comentários' }} />
      <Tabs.Screen name="desempenho" options={{ title: 'Desempenho' }} />
    </Tabs>
  );
}
