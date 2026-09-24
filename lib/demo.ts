import { useGlobalSearchParams } from 'expo-router';

/**
 * Modo demo (?demo=1): estados fixos para screenshots de apresentação.
 * Sem latência nos dados, sem permissões e com valores pré-definidos
 * (timer 15:02, player em "2 de 8", compositor preenchido...).
 */
let demoFlag = false;

export function setDemo(on: boolean) {
  demoFlag = on;
}

export function isDemo() {
  return demoFlag;
}

export function useDemo(): boolean {
  const { demo } = useGlobalSearchParams<{ demo?: string }>();
  return demo !== undefined && demo !== '0';
}
