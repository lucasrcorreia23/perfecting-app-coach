import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

import { cn } from '@/lib/utils';

/**
 * Tipografia do design system.
 * - display-*: Anton, sempre caixa alta. Hierarquia por tamanho.
 * - demais: Inter 400/500 (peso leve; 600 só se necessário).
 * Line-heights vêm da escala de fontSize (múltiplos de 4).
 */
const textVariants = cva(cn('font-sans text-14 text-text', Platform.select({ web: 'select-text' })), {
  variants: {
    variant: {
      'display-xl': 'font-display text-96 uppercase',
      'display-lg': 'font-display text-48 uppercase tracking-wide',
      'display-md': 'font-display text-32 uppercase tracking-wide',
      'display-sm': 'font-display text-24 uppercase tracking-wide',
      title: 'font-medium text-16',
      subtitle: 'font-sans text-14',
      body: 'font-sans text-14',
      caption: 'font-sans text-12 text-text-muted',
      label: 'font-sans text-12 uppercase tracking-wide text-text-muted',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;
type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  'display-xl': 'heading',
  'display-lg': 'heading',
  'display-md': 'heading',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'body',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
export type { TextVariant };
