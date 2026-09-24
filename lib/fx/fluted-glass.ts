/**
 * Vidro canelado (ribbed) com uma onda de luz atrás.
 * Portado de growth/lp-perfecting/frontend/lib/fx/fluted-glass.frag.ts para
 * GLSL ES 1.00, que compila no expo-gl do iOS, do Android e da web.
 *
 * As ranhuras são retas e verticais; o que ondula é a luz atrás delas. Cada
 * ranhura funciona como uma lente, então a linha curva vira uma sequência de
 * picos, como um espectro de som.
 */
export const FLUTED_VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FLUTED_FRAGMENT = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBg;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uFluteWidth;
uniform float uStrength;
uniform float uGrain;
uniform float uSpread;
uniform vec2 uSides;
uniform float uMirror;
uniform float uWave;
uniform float uDpr;

const float PI = 3.14159265;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float waveLine(float x, float U, float V, float A, float seed) {
  float t = uTime * 0.15;
  float k = x / U;
  float contour = cos(clamp(k, 0.0, 1.0) * PI);
  float partials =
      0.5 * sin(k * 4.1 + seed + t * 2.0)
    + 0.25 * sin(k * 9.3 - seed * 1.7 - t * 3.1)
    + 0.35 * (noise(vec2(k * 3.0 + seed * 5.0, t)) - 0.5);
  return V * 0.3 + A * (0.14 * contour + 0.05 * partials * uWave);
}

float lightLine(float d, float A, float V, float tail) {
  float core = exp(-abs(d) / (A * 0.016)) * 0.8 + exp(-abs(d) / (A * 0.07)) * 0.25;
  float curtain = smoothstep(-A * 0.03, A * 0.01, d) * exp(-max(d, 0.0) / (V * tail));
  return core + curtain * 0.75;
}

void sideLight(vec2 q, float U, float V, float A, float seed, out float glow, out float wave) {
  vec2 corner = (q - vec2(-0.12 * U, 0.14 * V)) / vec2(U * 0.72, V * 0.3);
  glow = exp(-dot(corner, corner) * 1.6) * smoothstep(0.02 * V, 0.2 * V, q.y);
  float reach = smoothstep(1.25 * U, 0.1 * U, q.x);
  float mainLine = lightLine(q.y - waveLine(q.x, U, V, A, seed), A, V, 0.16);
  float echoY = waveLine(q.x * 1.1 + U * 0.2, U, V, A, seed + 2.7) + V * 0.42;
  float echo = lightLine(q.y - echoY, A, V, 0.12);
  wave = (mainLine + echo * 0.45) * reach;
}

void main() {
  vec2 fragPx = gl_FragCoord.xy / uDpr;
  vec2 sizePx = uResolution / uDpr;
  vec2 px = vec2(fragPx.x, sizePx.y - fragPx.y);

  float P = min(sizePx.y, 1100.0);
  float m = mod(px.y, 2.0 * P);
  float y = m < P ? m : 2.0 * P - m;

  float U = min(P, max(sizePx.x * mix(0.3, 0.42, uSpread), 240.0));
  float V = min(P, U * 2.6);
  float A = min(V, U * 1.2);

  float stepW = max(uFluteWidth, 2.0);
  float cell = floor(px.x / stepW);
  float t = fract(px.x / stepW);
  float g = t < 0.88 ? t / 0.88 : 1.0 - smoothstep(0.88, 1.0, t);
  float lens = pow(g, 1.15) - 0.5;
  float magnify = 1.0 + 2.4 * clamp(uStrength, 0.0, 1.5);
  float sx = (cell + 0.5) * stepW + lens * stepW * magnify;

  float glowL = 0.0;
  float waveL = 0.0;
  float glowR = 0.0;
  float waveR = 0.0;
  if (uSides.x > 0.0) sideLight(vec2(sx, y), U, V, A, 0.0, glowL, waveL);
  if (uSides.y > 0.0) sideLight(vec2(sizePx.x - sx, mix(P - y, y, uMirror)), U, V, A, 4.3, glowR, waveR);

  float flute = 0.8 + 0.4 * hash(vec2(cell, 7.1));
  float glow = (glowL * uSides.x + glowR * uSides.y) * uStrength;
  float wave = (waveL * uSides.x + waveR * uSides.y) * uStrength * flute;

  vec3 color = uBg;
  color = mix(color, uColorB, clamp(glow * 0.75, 0.0, 1.0));
  color = mix(color, uColorA, clamp(glow * glow * 0.45 + wave * 0.7, 0.0, 1.0));
  color = mix(color, uColorC, clamp(wave * wave * 0.6, 0.0, 1.0));

  float lit = clamp(glow * 0.2 + wave * 0.8, 0.0, 1.0);
  float rim = pow(1.0 - t, 14.0);
  float seam = smoothstep(0.9, 1.0, t);
  color = mix(color, uColorC, rim * lit * 0.25);
  color = mix(color, uBg, seam * lit * 0.2);

  color += (hash(fragPx) - 0.5) * uGrain;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/** "#rrggbb" → [r, g, b] em 0..1 */
export function hexToRgb(hex: string): [number, number, number] {
  const int = parseInt(hex.replace('#', ''), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}
