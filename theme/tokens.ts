/**
 * Perfecting Field — design tokens (fonte única).
 *
 * Tudo que é cor, medida, raio ou tipo nasce aqui. O tailwind.config.js
 * importa este arquivo e SUBSTITUI as escalas padrão do Tailwind, então
 * só os valores abaixo existem como classe.
 *
 * Grid: base 8, subdivisão 4. Frame de referência: 390pt (iPhone 15).
 * Este arquivo deve conter apenas dados (sem imports), pois também é
 * carregado pelo Tailwind em Node.
 */

export const APP_NAME = 'Perfecting Field';
export const COACH_NAME = 'Coach';

export const colors = {
  transparent: 'transparent',
  // Rampa de neutros em grafite (as referências usam ~#222 de fundo e ~#2F2F2F em cartões).
  background: '#1F1F1F',
  surface: '#2A2A2A',
  'surface-elevated': '#353535',
  'surface-highlight': '#404040',
  border: '#363636',
  'border-strong': '#4A4A4A',
  text: '#FFFFFF',
  'text-muted': '#B8B8B8',
  'text-subtle': '#8C8C8C',
  primary: '#FF3D00',
  /** Texto/ícone sobre primary: escuro, como o preto sobre amarelo da referência (contraste 6,4:1). */
  'primary-foreground': '#0A0A0A',
  /** Faixa diagonal mais clara no header em bloco primary. */
  'primary-highlight': '#FF6A33',
  'primary-soft': 'rgba(255, 61, 0, 0.10)',
  success: '#4ADE80',
  warning: '#E5B454',
  danger: '#F87171',
  // Avatares: pastéis dessaturados, sempre com texto `background` por cima.
  'avatar-1': '#D6CFC4',
  'avatar-2': '#C4CCD6',
  'avatar-3': '#CFD6C4',
  'avatar-4': '#D6C4CC',
  // Dev: overlay de grid.
  'grid-4': 'rgba(64, 200, 255, 0.07)',
  'grid-8': 'rgba(64, 200, 255, 0.16)',
  'grid-margin': 'rgba(255, 0, 200, 0.08)',
  scrim: 'rgba(12, 12, 12, 0.72)',
  // Vidro canelado (ribbed) do fundo da gravação: luz branca bem suave.
  'fx-glow': '#2E2E2E',
  'fx-light': '#9A9A9A',
  'fx-peak': '#D6D6D6',
  // Vidro (liquid glass) da tab bar: véu claro translúcido, borda e brilho.
  glass: 'rgba(255, 255, 255, 0.08)',
  'glass-border': 'rgba(255, 255, 255, 0.14)',
  'glass-sheen': 'rgba(255, 255, 255, 0.16)',
  'glass-sheen-0': 'rgba(255, 255, 255, 0)',
  'glass-active': 'rgba(255, 255, 255, 0.14)',
  // Véus sobre fotos (hero): background com opacidade.
  'veil-0': 'rgba(31, 31, 31, 0)',
  'veil-50': 'rgba(31, 31, 31, 0.5)',
  'veil-90': 'rgba(31, 31, 31, 0.9)',
} as const;

/** Espaçamento permitido. Chave = valor em pt (`p-16` = 16pt). */
export const spacing = {
  0: 0,
  px: 1,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
} as const;

export const radius = {
  none: 0,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  full: 9999,
} as const;

export const borderWidth = {
  0: 0,
  DEFAULT: 1,
} as const;

/** Tamanhos de fonte com line-height múltiplo de 4. Chave = tamanho em pt. */
export const fontSize = {
  12: { size: 12, lineHeight: 16 },
  14: { size: 14, lineHeight: 20 },
  16: { size: 16, lineHeight: 24 },
  20: { size: 20, lineHeight: 28 },
  24: { size: 24, lineHeight: 32 },
  32: { size: 32, lineHeight: 40 },
  40: { size: 40, lineHeight: 48 },
  48: { size: 48, lineHeight: 48 },
  64: { size: 64, lineHeight: 64 },
  96: { size: 96, lineHeight: 96 },
} as const;

export const letterSpacing = {
  normal: 0,
  wide: 1,
} as const;

export const fontFamily = {
  display: 'Anton_400Regular',
  sans: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

/** Tamanhos de componentes (sempre dentro da escala de spacing). */
export const sizes = {
  icon: { sm: 16, md: 20, lg: 24 },
  iconButton: { sm: 32, md: 40, lg: 48 },
  avatar: { sm: 24, md: 32, lg: 40 },
  statusPill: 24,
  pillButton: { md: 40, lg: 48 },
  tabBar: 64,
  recordButton: 48,
  chart: 128,
  screenMargin: 16,
  frameWidth: 390,
  frameHeight: 844,
  /** hitSlop que leva cada botão a >= 44pt de área de toque. */
  hitSlop: { 32: 8, 40: 4, 48: 0, 24: 12 },
} as const;

/**
 * Moldura de marketing (/dev/marketing): imita o hardware do iPhone e fica
 * fora do app, por isso não segue a escala do grid. Export 1290x2796 (@3x).
 */
export const marketing = {
  canvas: { width: 430, height: 932 },
  scale: 0.78,
  bezel: 8,
  deviceRadius: 52,
  screenRadius: 44,
  statusBar: 48,
} as const;

export const motion = {
  pressScale: 0.97,
  duration: { fast: 120, base: 200, slow: 320 },
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
