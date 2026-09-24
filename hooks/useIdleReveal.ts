import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

type Options = {
  /** Tempo sem interação até voltar ao descanso. */
  timeoutMs?: number;
  /** Nunca entra em descanso (ex.: modo demo com informações). */
  disabled?: boolean;
};

/**
 * Descanso de tela: começa em repouso e "acorda" com qualquer interação.
 * - Nativo: chame `wake` em onTouchStart/onScrollBeginDrag.
 * - Web: também escuta mouse, roda do mouse, toque e teclado na janela.
 * Com leitor de tela ativo, nunca entra em descanso (a informação fica sempre acessível).
 * `setCanSleep(false)` impede o repouso (ex.: usuário rolou para baixo).
 */
export function useIdleReveal({ timeoutMs = 6000, disabled = false }: Options = {}) {
  const [idle, setIdle] = useState(!disabled);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canSleep = useRef(true);
  const screenReader = useRef(false);

  useEffect(() => {
    // No react-native-web essa API sempre responde true (o navegador não informa), então só vale no nativo.
    if (Platform.OS === 'web') return;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((on) => {
        screenReader.current = on;
        if (on) setIdle(false);
      })
      .catch(() => undefined);
  }, []);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (disabled || screenReader.current) return;
    timer.current = setTimeout(function sleep() {
      if (canSleep.current) setIdle(true);
      else timer.current = setTimeout(sleep, timeoutMs);
    }, timeoutMs);
  }, [disabled, timeoutMs]);

  const wake = useCallback(() => {
    setIdle(false);
    schedule();
  }, [schedule]);

  const setCanSleep = useCallback((value: boolean) => {
    canSleep.current = value;
  }, []);

  // Ao voltar para a tela, começa em repouso de novo.
  useFocusEffect(
    useCallback(() => {
      if (!disabled && !screenReader.current) setIdle(true);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }, [disabled]),
  );

  // Web: qualquer movimento de mouse, roda, toque ou tecla acorda.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'web' || disabled) return;
      const events = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart'] as const;
      events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
      return () => events.forEach((e) => window.removeEventListener(e, wake));
    }, [disabled, wake]),
  );

  return { idle: disabled ? false : idle, wake, setCanSleep };
}
