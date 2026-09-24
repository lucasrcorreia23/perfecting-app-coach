import { Fragment, useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { motion } from '@/theme/tokens';

import type { SheetProps } from './Sheet';

/** Fallback web do bottom sheet: modal simples com painel que sobe da base. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <View className="w-full max-w-frame flex-1 self-center justify-end">
        <Pressable accessibilityLabel="Fechar" onPress={onClose} className="absolute bottom-0 left-0 right-0 top-0 bg-scrim" />
        <Animated.View
          entering={SlideInDown.duration(motion.duration.slow)}
          exiting={SlideOutDown.duration(motion.duration.base)}
          className="gap-12 rounded-t-24 border-t border-border bg-surface-elevated px-16 pb-32 pt-12"
        >
          <View className="h-4 w-32 self-center rounded-full bg-border-strong" />
          {title ? <Text variant="label">{title}</Text> : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export const SheetProvider = Fragment;
