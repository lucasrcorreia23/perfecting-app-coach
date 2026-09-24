import { create } from 'zustand';

export const RATES = [1, 1.25, 1.5, 2] as const;
export type Rate = (typeof RATES)[number];

type PlayerState = {
  conversationId: string | null;
  /** conversa + posição inicial pedida; evita recarregar à toa. */
  loadKey: string | null;
  currentSec: number;
  durationSec: number;
  playing: boolean;
  rate: Rate;
  load: (conversationId: string, durationSec: number, startSec?: number) => void;
  seek: (sec: number) => void;
  skip: (delta: number) => void;
  toggle: () => void;
  pause: () => void;
  cycleRate: () => void;
  tick: (dt: number) => void;
};

/**
 * Player da conversa. A reprodução é simulada por relógio (o mock não tem áudio);
 * para áudio real, troque `tick` pelo status do expo-audio.
 */
export const usePlayer = create<PlayerState>((set, get) => ({
  conversationId: null,
  loadKey: null,
  currentSec: 0,
  durationSec: 0,
  playing: false,
  rate: 1,
  load: (conversationId, durationSec, startSec = 0) => {
    const loadKey = `${conversationId}:${startSec}`;
    if (get().loadKey === loadKey) return;
    set({ conversationId, loadKey, durationSec, currentSec: startSec, playing: false, rate: 1 });
  },
  seek: (sec) => set((s) => ({ currentSec: Math.min(Math.max(0, sec), s.durationSec) })),
  skip: (delta) => get().seek(get().currentSec + delta),
  toggle: () => set((s) => ({ playing: !s.playing })),
  pause: () => set({ playing: false }),
  cycleRate: () => set((s) => ({ rate: RATES[(RATES.indexOf(s.rate) + 1) % RATES.length]! })),
  tick: (dt) =>
    set((s) => {
      const next = s.currentSec + dt * s.rate;
      return next >= s.durationSec ? { currentSec: s.durationSec, playing: false } : { currentSec: next };
    }),
}));
