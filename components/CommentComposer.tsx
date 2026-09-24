import { AtSign, Mic } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { IconButton } from '@/components/IconButton';
import { MentionInput } from '@/components/MentionInput';
import { PressableScale } from '@/components/PressableScale';
import { SendButton } from '@/components/SendButton';
import { VisibilityToggle } from '@/components/VisibilityToggle';
import { Text } from '@/components/ui/text';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { formatClock } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { mentionTargets } from '@/mocks/people';
import type { Visibility } from '@/types/domain';
import { colors } from '@/theme/tokens';

type CommentComposerProps = {
  startSec: number;
  endSec: number;
  initialText?: string;
  sending?: boolean;
  onSend: (text: string, visibility: Visibility) => Promise<unknown> | void;
};

/** Termo de menção sendo digitado no fim do texto ("@Ven"). */
function mentionQuery(text: string): string | null {
  const m = text.match(/@([\wÀ-ÿ]*)$/);
  return m ? (m[1] ?? '') : null;
}

/**
 * Compositor de comentário fixo acima do teclado: intervalo comentado,
 * campo com menções, @ e áudio, Público/Privado e enviar.
 */
export function CommentComposer({ startSec, endSec, initialText = '', sending, onSend }: CommentComposerProps) {
  const [text, setText] = useState(initialText);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const input = useRef<TextInput>(null);
  const inset = useKeyboardInset();

  const query = mentionQuery(text);
  const suggestions =
    query === null ? [] : mentionTargets.filter((t) => t.handle.toLowerCase().startsWith(query.toLowerCase()));

  const pickMention = (handle: string) => {
    haptics.selection();
    setText((t) => t.replace(/@([\wÀ-ÿ]*)$/, `@${handle} `));
    input.current?.focus();
  };

  const send = async () => {
    const value = text.trim();
    if (!value) return;
    haptics.success();
    await onSend(value, visibility);
    setText('');
  };

  return (
    <Animated.View style={inset} className="gap-12 rounded-t-24 border-t border-border bg-surface-elevated px-16 pt-16">
      <Text variant="caption">
        Comentando em{' '}
        <Text variant="caption" className="text-text-subtle" style={{ fontVariant: ['tabular-nums'] }}>
          {formatClock(startSec)} a {formatClock(endSec)}
        </Text>
      </Text>

      <MentionInput
        ref={input}
        value={text}
        onChangeText={setText}
        placeholder="Escreva um comentário ou @mencione alguém"
        placeholderTextColor={colors['text-subtle']}
        accessibilityLabel="Comentário"
      />

      {suggestions.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-8" keyboardShouldPersistTaps="handled">
          {suggestions.map((s) => (
            <PressableScale
              key={s.handle}
              accessibilityRole="button"
              accessibilityLabel={`Mencionar ${s.label}`}
              onPress={() => pickMention(s.handle)}
              className="h-32 flex-row items-center gap-4 rounded-full border border-border-strong px-12"
            >
              <Text className="font-sans text-12 text-primary">@{s.handle}</Text>
              <Text variant="caption">{s.label}</Text>
            </PressableScale>
          ))}
        </ScrollView>
      ) : null}

      <View className="flex-row items-center gap-8">
        <IconButton
          icon={AtSign}
          label="Mencionar"
          onPress={() => {
            setText((t) => (t.length === 0 || t.endsWith(' ') ? `${t}@` : `${t} @`));
            input.current?.focus();
          }}
        />
        <IconButton icon={Mic} label="Gravar comentário em áudio" />
        <VisibilityToggle value={visibility} onChange={setVisibility} />
        <View className="flex-1" />
        <SendButton disabled={!text.trim() || sending} onPress={send} />
      </View>
    </Animated.View>
  );
}
