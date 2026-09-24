/**
 * Escalas SUBSTITUÍDAS (não estendidas): só os tokens de theme/tokens.ts
 * existem como classe. Nada de valores arbitrários (p-[13px]).
 * O Tailwind carrega este arquivo com jiti, por isso o require de .ts funciona.
 */
const t = require('./theme/tokens.ts');

const px = (scale) =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tema dark único; 'class' evita conflito com userInterfaceStyle=dark no app.json.
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: t.colors,
    spacing: px(t.spacing),
    borderRadius: px(t.radius),
    borderWidth: px(t.borderWidth),
    fontSize: Object.fromEntries(
      Object.entries(t.fontSize).map(([k, v]) => [k, [`${v.size}px`, { lineHeight: `${v.lineHeight}px` }]]),
    ),
    // Line-heights da escala de fonte + 56 (headlines em Anton com acentos). Todos múltiplos de 4.
    lineHeight: Object.fromEntries(
      [...Object.values(t.fontSize).map((v) => v.lineHeight), 56].map((lh) => [lh, `${lh}px`]),
    ),
    letterSpacing: px(t.letterSpacing),
    fontFamily: Object.fromEntries(Object.entries(t.fontFamily).map(([k, v]) => [k, [v]])),
    // Sem pesos sintéticos: o peso vem da família (Inter_500Medium etc).
    fontWeight: { normal: '400' },
    boxShadow: { none: 'none' },
    maxWidth: { frame: `${t.sizes.frameWidth}px`, full: '100%', none: 'none', '3/4': '75%', '5/6': '83.333333%' },
    extend: {},
  },
  plugins: [],
};
