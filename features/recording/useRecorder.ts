import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PermissionState = 'checking' | 'undetermined' | 'granted' | 'denied';
export type RecorderPhase = 'idle' | 'recording' | 'paused';

export const WAVE_BARS = 44;
const TICK_MS = 80;

/** dBFS (-160..0) → 0..1, com piso em -55 dB para ignorar ruído de fundo. */
function normalize(db: number): number {
  const floor = -55;
  return Math.min(1, Math.max(0, (db - floor) / -floor)) ** 1.6;
}

/** Nível simulado convincente (fala com sílabas e pausas) quando não há metering. */
function simulatedLevel(t: number): number {
  const syllable = Math.abs(Math.sin(t * 7.3)) * 0.6 + Math.abs(Math.sin(t * 2.1 + 1)) * 0.4;
  const phrase = Math.sin(t * 0.9) > -0.35 ? 1 : 0.08;
  return Math.min(1, syllable * phrase * (0.55 + Math.random() * 0.45));
}

type Options = { demo?: boolean; demoElapsedSec?: number };

/**
 * Gravação real com expo-audio + metering. O histórico de níveis alimenta a waveform.
 * No modo demo (ou sem metering, ex.: alguns navegadores), o nível é simulado.
 */
export function useRecorder({ demo = false, demoElapsedSec = 902 }: Options = {}) {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const state = useAudioRecorderState(recorder, TICK_MS);

  const [permission, setPermission] = useState<PermissionState>(demo ? 'granted' : 'checking');
  const [phase, setPhase] = useState<RecorderPhase>(demo ? 'recording' : 'idle');
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: WAVE_BARS }, (_, i) => (demo ? simulatedLevel(i * (TICK_MS / 1000)) : 0)),
  );
  const [error, setError] = useState<string | null>(null);
  const lastMeter = useRef<{ value?: number; at: number }>({ at: 0 });
  const startedAt = useRef(Date.now());
  /** Instância de recorder que foi preparada (prepareToRecordAsync). */
  const prepared = useRef<typeof recorder | null>(null);

  // Se o recorder for recriado (ex.: hot reload na web), a gravação anterior se perdeu:
  // volta ao estado inicial para a tela rearmar a gravação em vez de chamar pause/stop num recorder vazio.
  useEffect(() => {
    if (demo) return;
    if (prepared.current && prepared.current !== recorder) {
      prepared.current = null;
      setPhase('idle');
    }
  }, [demo, recorder]);

  useEffect(() => {
    if (demo) return;
    getRecordingPermissionsAsync()
      .then((p) => setPermission(p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied'))
      .catch(() => setPermission('undetermined'));
  }, [demo]);

  if (state.metering !== undefined && state.metering !== lastMeter.current.value) {
    lastMeter.current = { value: state.metering, at: Date.now() };
  }

  // Histórico de níveis: desloca para a esquerda a cada tick.
  useEffect(() => {
    if (phase !== 'recording') return;
    const id = setInterval(() => {
      const fresh = Date.now() - lastMeter.current.at < 600 && lastMeter.current.value !== undefined;
      const level = !demo && fresh ? normalize(lastMeter.current.value!) : simulatedLevel((Date.now() - startedAt.current) / 1000);
      setLevels((prev) => [...prev.slice(1), level]);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase, demo]);

  const requestPermission = useCallback(async () => {
    const p = await requestRecordingPermissionsAsync();
    setPermission(p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied');
    return p.granted;
  }, []);

  const prepareAndRecord = useCallback(async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    prepared.current = recorder;
    startedAt.current = Date.now();
  }, [recorder]);

  const start = useCallback(async () => {
    if (demo) return setPhase('recording');
    try {
      setError(null);
      await prepareAndRecord();
      setPhase('recording');
    } catch {
      prepared.current = null;
      setError('Microfone indisponível');
      setPhase('idle');
    }
  }, [demo, prepareAndRecord]);

  const pause = useCallback(() => {
    if (!demo && prepared.current === recorder) {
      try {
        recorder.pause();
      } catch {
        prepared.current = null;
      }
    }
    setPhase('paused');
  }, [demo, recorder]);

  const resume = useCallback(async () => {
    if (demo) return setPhase('recording');
    try {
      // Recorder perdido enquanto pausado: prepara de novo e começa um novo trecho.
      if (prepared.current === recorder) recorder.record();
      else await prepareAndRecord();
      setPhase('recording');
    } catch {
      prepared.current = null;
      setError('Microfone indisponível');
      setPhase('idle');
    }
  }, [demo, prepareAndRecord, recorder]);

  const stop = useCallback(async () => {
    const elapsed = demo ? demoElapsedSec : Math.round(state.durationMillis / 1000);
    if (!demo && prepared.current === recorder) {
      await recorder.stop().catch(() => undefined);
    }
    prepared.current = null;
    await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
    setPhase('idle');
    setLevels(Array.from({ length: WAVE_BARS }, () => 0));
    return { durationSec: elapsed, uri: demo ? null : recorder.uri };
  }, [demo, demoElapsedSec, recorder, state.durationMillis]);

  return {
    permission,
    phase,
    error,
    levels,
    elapsedSec: demo ? demoElapsedSec : state.durationMillis / 1000,
    requestPermission,
    start,
    pause,
    resume,
    stop,
  };
}
