import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme/tokens';

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

/** Bottom sheet nativo (@gorhom/bottom-sheet). Na web, ver Sheet.web.tsx. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const ref = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (open) ref.current?.present();
    else ref.current?.dismiss();
  }, [open]);

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onClose}
      enableDynamicSizing
      backdropComponent={backdrop}
      backgroundStyle={{ backgroundColor: colors['surface-elevated'], borderRadius: radius[24] }}
      handleIndicatorStyle={{ backgroundColor: colors['border-strong'], width: spacing[32] }}
    >
      <BottomSheetView style={{ paddingHorizontal: spacing[16], paddingBottom: insets.bottom + spacing[16], gap: spacing[12] }}>
        {title ? <Text variant="label">{title}</Text> : null}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export { BottomSheetModalProvider as SheetProvider } from '@gorhom/bottom-sheet';
