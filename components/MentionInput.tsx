import { forwardRef } from 'react';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';

import { splitMentions } from '@/components/MentionText';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { colors } from '@/theme/tokens';

type MentionInputProps = Omit<TextInputProps, 'children'> & { value: string };

const INPUT = 'min-h-24 p-0 font-sans text-16 text-text';

function Spans({ value }: { value: string }) {
  return splitMentions(value).map(({ part, mention }, i) => (
    <Text key={i} className={mention ? 'font-sans text-16 text-primary' : 'font-sans text-16 text-text'}>
      {part}
    </Text>
  ));
}

/**
 * Campo de texto com menções (@Vendas) destacadas em primary.
 * Nativo: spans como filhos do TextInput. Web: texto transparente sobre uma camada destacada.
 */
export const MentionInput = forwardRef<TextInput, MentionInputProps>(function MentionInput({ value, className, ...props }, ref) {
  if (Platform.OS !== 'web') {
    return (
      <TextInput ref={ref} multiline selectionColor={colors.primary} className={cn(INPUT, className)} {...props}>
        <Spans value={value} />
      </TextInput>
    );
  }

  return (
    <View className="relative">
      <Text aria-hidden className={cn(INPUT, 'absolute left-0 right-0 top-0')}>
        <Spans value={value} />
      </Text>
      <TextInput
        ref={ref}
        multiline
        value={value}
        selectionColor={colors.primary}
        className={cn(INPUT, className)}
        style={{ color: colors.transparent, caretColor: colors.text } as object}
        {...props}
      />
    </View>
  );
});
