import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { fontFamily, fontSize } from '@/theme/tokens';

/**
 * tailwind-merge precisa conhecer as escalas customizadas:
 * - fontSize numérico (text-12, text-14...) não pode ser confundido com cor (text-text-muted);
 * - pesos vêm da família (font-semibold = Inter_600SemiBold), então família e peso
 *   são o mesmo grupo e a última classe vence.
 */
const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'font-size': [{ text: Object.keys(fontSize) }],
      'font-weight': [],
      'font-family': [{ font: Object.keys(fontFamily) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
