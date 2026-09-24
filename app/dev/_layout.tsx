import { Stack, usePathname } from "expo-router";
import { Grid3x3 } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/IconButton";
import { useDevStore } from "@/stores/dev";
import { colors, spacing } from "@/theme/tokens";

/** Rotas /dev: ferramentas internas, com botão flutuante do overlay de grid. */
export default function DevLayout() {
  const { gridVisible, toggleGrid } = useDevStore();
  const insets = useSafeAreaInsets();
  // Na moldura de marketing o botão apareceria nos exports.
  const hideToggle = usePathname().startsWith("/dev/marketing");

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      {hideToggle ? null : (
        <View
          pointerEvents="box-none"
          className="absolute right-16"
          style={{ bottom: insets.bottom + spacing[16] }}
        >
          <IconButton
            icon={Grid3x3}
            label={gridVisible ? "Ocultar grid" : "Mostrar grid"}
            size="lg"
            variant="outline"
            iconColor={gridVisible ? "primary" : "text"}
            onPress={toggleGrid}
          />
        </View>
      )}
    </View>
  );
}
