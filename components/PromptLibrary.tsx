import { ChevronRight, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { promptLibrary } from '@/mocks/coach';

type PromptLibraryProps = {
  open: boolean;
  onClose: () => void;
  onPick: (prompt: string) => void;
};

/** Biblioteca de prompts prontos para o Coach. */
export function PromptLibrary({ open, onClose, onPick }: PromptLibraryProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Biblioteca de prompts">
      <View className="rounded-16 border border-border bg-surface">
        {promptLibrary.map((p, i) => (
          <View key={p}>
            {i > 0 ? <Separator /> : null}
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={p}
              haptic="selection"
              onPress={() => onPick(p)}
              className="h-48 flex-row items-center gap-12 px-16"
            >
              <Icon as={Sparkles} size="sm" color="text-muted" />
              <Text variant="body" className="flex-1">
                {p}
              </Text>
              <Icon as={ChevronRight} size="sm" color="text-subtle" />
            </PressableScale>
          </View>
        ))}
      </View>
    </Sheet>
  );
}
