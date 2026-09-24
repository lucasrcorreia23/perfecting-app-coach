import { ArrowUp } from 'lucide-react-native';

import { IconButton } from '@/components/IconButton';
import type { PressableScaleProps } from '@/components/PressableScale';

type SendButtonProps = Omit<PressableScaleProps, 'children'> & { label?: string };

/** Botão de enviar: círculo primary de 32 com seta (como a referência). */
export function SendButton({ label = 'Enviar', disabled, ...props }: SendButtonProps) {
  return (
    <IconButton
      icon={ArrowUp}
      label={label}
      size="sm"
      variant="primary"
      haptic="light"
      disabled={disabled}
      className={disabled ? 'bg-surface-highlight' : undefined}
      iconColor={disabled ? 'text-subtle' : 'primary-foreground'}
      {...props}
    />
  );
}
