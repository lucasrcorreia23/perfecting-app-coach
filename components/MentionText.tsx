import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export const MENTION_RE = /(@[\wÀ-ÿ]+)/g;

/** Divide um texto em partes normais e menções (@Nome). */
export function splitMentions(text: string) {
  return text.split(MENTION_RE).filter(Boolean).map((part) => ({ part, mention: part.startsWith('@') }));
}

/** Texto com menções destacadas em primary. */
export function MentionText({ text, className }: { text: string; className?: string }) {
  return (
    <Text variant="body" className={className}>
      {splitMentions(text).map(({ part, mention }, i) =>
        mention ? (
          <Text key={i} className={cn('font-medium text-14 text-primary')}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
