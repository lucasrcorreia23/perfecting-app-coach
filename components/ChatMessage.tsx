import { RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

import { CitationBadge } from '@/components/CitationBadge';
import { IconButton } from '@/components/IconButton';
import { Text } from '@/components/ui/text';
import { haptics } from '@/lib/haptics';
import type { CoachBlock, CoachInline, CoachMessage } from '@/types/domain';
import { motion } from '@/theme/tokens';

function Inline({ content, onCite }: { content: CoachInline[]; onCite: (sec: number) => void }) {
  return (
    <Text variant="body" className="flex-1 text-text">
      {content.map((c, i) =>
        c.type === 'text' ? (
          c.text
        ) : (
          <Text key={i}>
            {' '}
            <CitationBadge n={c.n} atSec={c.atSec} onPress={() => onCite(c.atSec)} />
          </Text>
        ),
      )}
    </Text>
  );
}

function Block({ block, onCite }: { block: CoachBlock; onCite: (sec: number) => void }) {
  if (block.type === 'paragraph') return <Inline content={block.content} onCite={onCite} />;
  return (
    <View className="gap-8">
      {block.items.map((item, i) => (
        <View key={i} className="flex-row gap-4">
          <Text variant="body" className="w-20 text-text-muted" style={{ fontVariant: ['tabular-nums'] }}>
            {i + 1}.
          </Text>
          <Inline content={item} onCite={onCite} />
        </View>
      ))}
    </View>
  );
}

type ChatMessageProps = {
  message: CoachMessage;
  onCite: (sec: number) => void;
  onRegenerate?: () => void;
};

/** Mensagem do chat: usuário em balão à direita; Coach em texto corrido com citações. */
export function ChatMessage({ message, onCite, onRegenerate }: ChatMessageProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  if (message.role === 'user') {
    return (
      <Animated.View entering={FadeInDown.duration(motion.duration.base)} className="max-w-5/6 self-end rounded-16 bg-surface-elevated px-16 py-12">
        <Text variant="body">{message.text}</Text>
      </Animated.View>
    );
  }

  const choose = (v: 'up' | 'down') => {
    haptics.selection();
    setVote((cur) => (cur === v ? null : v));
  };

  return (
    <Animated.View entering={FadeInDown.duration(motion.duration.slow)} className="gap-12">
      {message.blocks.map((b, i) => (
        <Block key={i} block={b} onCite={onCite} />
      ))}
      <View className="-ml-8 flex-row gap-4">
        <IconButton icon={RefreshCw} label="Gerar novamente" size="sm" variant="ghost" iconColor="text-subtle" onPress={onRegenerate} />
        <IconButton
          icon={ThumbsUp}
          label="Resposta útil"
          size="sm"
          variant="ghost"
          iconColor={vote === 'up' ? 'text' : 'text-subtle'}
          onPress={() => choose('up')}
        />
        <IconButton
          icon={ThumbsDown}
          label="Resposta não útil"
          size="sm"
          variant="ghost"
          iconColor={vote === 'down' ? 'text' : 'text-subtle'}
          onPress={() => choose('down')}
        />
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.set(withDelay(delay, withRepeat(withTiming(1, { duration: motion.duration.slow * 2 }), -1, true)));
  }, [delay, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return <Animated.View style={style} className="h-8 w-8 rounded-full bg-text-muted" />;
}

/** Indicador de "Coach escrevendo". */
export function TypingIndicator() {
  return (
    <View accessibilityLabel="Coach escrevendo" className="h-24 flex-row items-center gap-4">
      <Dot delay={0} />
      <Dot delay={motion.duration.fast} />
      <Dot delay={motion.duration.fast * 2} />
    </View>
  );
}
