import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Primitiva de botão (base react-native-reusables adaptada ao tema).
 * Os botões de produto (IconButton, PillButton, SendButton) compõem esta base
 * com PressableScale; aqui ficam só forma, cor e tamanho.
 */
const buttonVariants = cva(
  cn(
    'shrink-0 flex-row items-center justify-center gap-8',
    Platform.select({ web: 'outline-none focus-visible:border-border-strong' }),
  ),
  {
    variants: {
      variant: {
        /** Pill com borda (ex: "Concluir", "Anterior"). */
        outline: 'border border-border-strong bg-surface-elevated',
        /** Ação principal da tela. */
        primary: 'bg-primary',
        /** Fundo elevado sem borda (botões de ícone). */
        secondary: 'bg-surface-elevated',
        ghost: 'bg-transparent',
      },
      shape: {
        pill: 'rounded-full',
        circle: 'rounded-full',
        square: 'rounded-12',
      },
      size: {
        sm: 'h-32',
        md: 'h-40',
        lg: 'h-48',
      },
    },
    compoundVariants: [
      { shape: 'pill', size: 'sm', className: 'px-12' },
      { shape: 'pill', size: 'md', className: 'px-16' },
      { shape: 'pill', size: 'lg', className: 'px-20' },
      { shape: ['circle', 'square'], size: 'sm', className: 'w-32' },
      { shape: ['circle', 'square'], size: 'md', className: 'w-40' },
      { shape: ['circle', 'square'], size: 'lg', className: 'w-48' },
    ],
    defaultVariants: {
      variant: 'outline',
      shape: 'pill',
      size: 'md',
    },
  },
);

const buttonTextVariants = cva('font-medium text-14', {
  variants: {
    variant: {
      outline: 'text-text',
      primary: 'text-primary-foreground',
      secondary: 'text-text',
      ghost: 'text-text-muted',
    },
  },
  defaultVariants: { variant: 'outline' },
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, shape, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, shape, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
