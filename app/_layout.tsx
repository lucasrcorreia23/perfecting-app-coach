import '../global.css';
import '@/lib/interop';

import { Anton_400Regular } from '@expo-google-fonts/anton';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GridOverlay } from '@/components/GridOverlay';
import { SheetProvider } from '@/components/Sheet';
import { setDemo, useDemo } from '@/lib/demo';
import { cn } from '@/lib/utils';
import { queryClient } from '@/lib/query-client';
import { useDevStore } from '@/stores/dev';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

/** Liga o overlay de grid quando a URL tem ?grid=1. */
function useGridParam() {
  const { grid } = useGlobalSearchParams<{ grid?: string }>();
  const setGridVisible = useDevStore((s) => s.setGridVisible);
  useEffect(() => {
    if (grid !== undefined) setGridVisible(grid === '1');
  }, [grid, setGridVisible]);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  useGridParam();
  const demo = useDemo();
  setDemo(demo);
  // A moldura de marketing precisa de largura livre (430) na web.
  const fullBleed = usePathname().startsWith('/dev/marketing');

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <QueryClientProvider client={queryClient}>
        <SheetProvider>
        <StatusBar style="light" />
        {/* Na web o app fica preso ao frame de 390pt, centralizado. */}
        <View className={cn('w-full flex-1 self-center overflow-hidden bg-background', !fullBleed && 'max-w-frame')}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="conversa/[id]/index" options={{ animation: 'slide_from_right' }} />
          </Stack>
          <GridOverlay />
        </View>
        </SheetProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
