import { create } from 'zustand';

type DevState = {
  gridVisible: boolean;
  setGridVisible: (visible: boolean) => void;
  toggleGrid: () => void;
};

/** Estado de ferramentas de desenvolvimento (overlay de grid). */
export const useDevStore = create<DevState>((set) => ({
  gridVisible: false,
  setGridVisible: (gridVisible) => set({ gridVisible }),
  toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),
}));
