import { SquareSlash, Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ChatMessage, TypingIndicator } from '@/components/ChatMessage';
import { EmptyState } from '@/components/EmptyState';
import { PillButton } from '@/components/PillButton';
import { PromptLibrary } from '@/components/PromptLibrary';
import { SendButton } from '@/components/SendButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useAskCoach, useCoachThread } from '@/hooks/queries';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { COACH_NAME, colors } from '@/theme/tokens';

import { useConversationContext } from './context';

export function CoachTab() {
  const { conversation, jumpTo, demo } = useConversationContext();
  const thread = useCoachThread(conversation.id);
  const ask = useAskCoach(conversation.id);
  const [text, setText] = useState(demo ? 'Quais objeções não foram contornadas?' : '');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const inset = useKeyboardInset();

  const messages = thread.data ?? [];
  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user');

  useEffect(() => {
    if (messages.length > 0) requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
  }, [messages.length, ask.isPending]);

  const send = (question: string) => {
    const q = question.trim();
    if (!q || ask.isPending) return;
    setText('');
    ask.mutate(q);
  };

  return (
    <View className="flex-1">
      <ScrollView ref={scroll} className="flex-1" contentContainerClassName="gap-24 px-16 py-24" showsVerticalScrollIndicator={false}>
        {thread.isPending ? (
          <View className="gap-12">
            <Skeleton className="h-40 w-1/2 self-end rounded-16" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-5/6" />
            <Skeleton className="h-16 w-3/4" />
          </View>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={`Pergunte ao ${COACH_NAME}`}
            description="Ele leu a conversa inteira e responde citando os trechos da transcrição."
            action={{ label: 'Ver sugestões', onPress: () => setLibraryOpen(true) }}
          />
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              onCite={jumpTo}
              onRegenerate={lastQuestion?.role === 'user' ? () => send(lastQuestion.text) : undefined}
            />
          ))
        )}
        {ask.isPending ? <TypingIndicator /> : null}
      </ScrollView>

      <Animated.View style={inset} className="gap-12 rounded-t-24 border-t border-border bg-surface-elevated px-16 pt-12">
        <View className="h-4 w-32 self-center rounded-full bg-border-strong" />
        <View className="flex-row items-center gap-12">
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder={`Pergunte ao ${COACH_NAME} sobre esta conversa`}
            placeholderTextColor={colors['text-subtle']}
            selectionColor={colors.primary}
            accessibilityLabel={`Mensagem para o ${COACH_NAME}`}
            className="max-h-80 min-h-40 flex-1 p-0 py-8 font-sans text-14 text-text"
          />
          <SendButton disabled={!text.trim() || ask.isPending} onPress={() => send(text)} />
        </View>
        <View className="flex-row">
          <PillButton size="sm" variant="outline" icon={SquareSlash} label="Biblioteca de prompts" onPress={() => setLibraryOpen(true)} />
        </View>
      </Animated.View>

      <PromptLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(p) => {
          setLibraryOpen(false);
          send(p);
        }}
      />
    </View>
  );
}
