import { Lock, MessageSquare } from 'lucide-react-native';
import { useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar } from '@/components/Avatar';
import { CommentComposer } from '@/components/CommentComposer';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { MentionText } from '@/components/MentionText';
import { TimestampChip } from '@/components/TimestampChip';
import { TranscriptLine } from '@/components/TranscriptLine';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useComments, usePostComment } from '@/hooks/queries';
import { formatDayTime } from '@/lib/format';
import { personById } from '@/mocks/people';
import { ts } from '@/mocks/time';
import type { Comment } from '@/types/domain';
import { motion } from '@/theme/tokens';

import { useConversationContext, type Range } from './context';
import { speakerInfo } from './speakers';

const FOLLOWING_LINES = 2;

function CommentItem({ comment, onAnchor }: { comment: Comment; onAnchor: (r: Range) => void }) {
  const author = personById(comment.authorId);
  return (
    <Animated.View entering={FadeInDown.duration(motion.duration.base)} className="gap-8 px-16 py-16">
      <View className="flex-row items-center gap-8">
        <Avatar initials={author.initials} tone={author.avatarColor} size="sm" />
        <Text className="font-sans text-12">{author.name}</Text>
        <Text variant="caption" className="flex-1" numberOfLines={1}>
          {formatDayTime(comment.createdAt)}
        </Text>
        {comment.visibility === 'private' ? (
          <View className="flex-row items-center gap-4">
            <Icon as={Lock} size="sm" color="text-subtle" />
            <Text variant="caption" className="text-text-subtle">
              Privado
            </Text>
          </View>
        ) : null}
      </View>
      <MentionText text={comment.text} />
      <TimestampChip sec={comment.startSec} endSec={comment.endSec} onPress={() => onAnchor(comment)} />
    </Animated.View>
  );
}

export function CommentsTab() {
  const { conversation, transcript, anchor, commentOn, jumpTo, demo } = useConversationContext();
  const comments = useComments(conversation.id);
  const post = usePostComment(conversation.id);
  const scroll = useRef<ScrollView>(null);

  // Sem trecho escolhido: ancora no comentário público mais recente.
  const latestPublic = comments.data?.find((c) => c.visibility === 'public') ?? comments.data?.[0];
  const range: Range = anchor ?? latestPublic ?? { startSec: ts('27:02'), endSec: ts('27:10') };

  // Falas citadas (começam dentro do intervalo) e as seguintes, como contexto.
  const excerpt = useMemo(() => {
    const list = transcript?.utterances ?? [];
    const first = list.findIndex((u) => u.startSec >= range.startSec && u.startSec < Math.max(range.endSec, range.startSec + 1));
    if (first < 0) return { quoted: [], following: [] };
    let last = first;
    while (list[last + 1] && list[last + 1]!.startSec < range.endSec) last++;
    return { quoted: list.slice(first, last + 1), following: list.slice(last + 1, last + 1 + FOLLOWING_LINES) };
  }, [transcript, range.startSec, range.endSec]);

  return (
    <View className="flex-1">
      <ScrollView ref={scroll} className="flex-1" contentContainerClassName="gap-4 pb-24 pt-16" showsVerticalScrollIndicator={false}>
        {transcript
          ? [
              ...excerpt.quoted.map((u) => (
                <TranscriptLine key={u.id} utterance={u} {...speakerInfo(conversation, transcript, u.speaker)} state="quoted" onPress={() => jumpTo(u.startSec)} />
              )),
              ...excerpt.following.map((u) => (
                <TranscriptLine key={u.id} utterance={u} {...speakerInfo(conversation, transcript, u.speaker)} onPress={() => jumpTo(u.startSec)} />
              )),
            ]
          : null}

        <View className="px-16 pb-4 pt-24">
          <Text variant="label">
            Comentários{comments.data ? ` · ${comments.data.length}` : ''}
          </Text>
        </View>
        {comments.isPending ? (
          <View className="gap-8 px-16 py-16">
            <Skeleton className="h-16 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </View>
        ) : comments.data?.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Sem comentários" description="Selecione um trecho da transcrição e deixe o primeiro comentário." />
        ) : (
          comments.data?.map((c, i) => (
            <View key={c.id}>
              {i > 0 ? <Separator className="mx-16 w-auto" /> : null}
              <CommentItem
                comment={c}
                onAnchor={(r) => {
                  commentOn({ startSec: r.startSec, endSec: r.endSec });
                  scroll.current?.scrollTo({ y: 0, animated: true });
                }}
              />
            </View>
          ))
        )}
      </ScrollView>

      <CommentComposer
        key={`${range.startSec}-${range.endSec}`}
        startSec={range.startSec}
        endSec={range.endSec}
        initialText={demo ? '@Vendas vejam como ele segurou o preço aqui!' : ''}
        sending={post.isPending}
        onSend={(text, visibility) => post.mutateAsync({ startSec: range.startSec, endSec: range.endSec, text, visibility })}
      />
    </View>
  );
}
