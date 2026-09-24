import { router, usePathname } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';

/** Rota inexistente: estado vazio no estilo do app, com volta para o Início. */
export default function NotFound() {
  const path = usePathname();
  return (
    <View className="flex-1 justify-center bg-background">
      <EmptyState
        icon={SearchX}
        title="Página não encontrada"
        description={`Não existe nada em ${path}.`}
        action={{ label: 'Ir para o Início', onPress: () => router.replace('/') }}
      />
    </View>
  );
}
