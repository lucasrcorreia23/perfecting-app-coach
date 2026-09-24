import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { FLUTED_FRAGMENT, FLUTED_VERTEX, hexToRgb } from '@/lib/fx/fluted-glass';
import { colors } from '@/theme/tokens';

type FlutedGlassProps = {
  /** Largura de uma ranhura em pt. */
  fluteWidth?: number;
  /** Intensidade da luz (a LP usa 1; aqui, bem sutil). */
  strength?: number;
  grain?: number;
  /** Deriva lenta da onda de luz (desligada com "reduzir movimento"). */
  animate?: boolean;
};

const FPS_MS = 1000 / 30;

function compile(gl: ExpoWebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (__DEV__) console.warn('[FlutedGlass] shader:', gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

/**
 * Fundo em vidro canelado (ribbed) com uma onda de luz branca bem suave,
 * portado do FlutedGlass da LP. Roda via expo-gl no iOS, no Android e na web,
 * a 30 quadros por segundo, e pausa quando a tela perde o foco.
 */
export function FlutedGlass({ fluteWidth = 24, strength = 0.26, grain = 0.02, animate = true }: FlutedGlassProps) {
  const [width, setWidth] = useState(0);
  const active = useRef(true);
  const reduceMotion = useRef(false);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        reduceMotion.current = v;
      })
      .catch(() => undefined);
    return () => cleanup.current?.();
  }, []);

  useFocusEffect(
    useCallback(() => {
      active.current = true;
      return () => {
        active.current = false;
      };
    }, []),
  );

  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      const vs = compile(gl, gl.VERTEX_SHADER, FLUTED_VERTEX);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FLUTED_FRAGMENT);
      if (!vs || !fs) return;
      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      // Triângulo que cobre a tela inteira.
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const u = (name: string) => gl.getUniformLocation(program, name);
      const W = gl.drawingBufferWidth;
      const H = gl.drawingBufferHeight;
      const dpr = width > 0 ? W / width : 1;

      gl.viewport(0, 0, W, H);
      gl.uniform2f(u('uResolution'), W, H);
      gl.uniform3fv(u('uBg'), hexToRgb(colors.background));
      gl.uniform3fv(u('uColorA'), hexToRgb(colors['fx-light']));
      gl.uniform3fv(u('uColorB'), hexToRgb(colors['fx-glow']));
      gl.uniform3fv(u('uColorC'), hexToRgb(colors['fx-peak']));
      gl.uniform1f(u('uFluteWidth'), fluteWidth);
      gl.uniform1f(u('uStrength'), strength);
      gl.uniform1f(u('uGrain'), grain);
      gl.uniform1f(u('uSpread'), 1);
      gl.uniform2f(u('uSides'), 1, 1);
      gl.uniform1f(u('uMirror'), 0);
      gl.uniform1f(u('uWave'), 1);
      gl.uniform1f(u('uDpr'), dpr);
      const uTime = u('uTime');

      const start = Date.now();
      let last = 0;
      let raf = 0;
      let disposed = false;

      const draw = () => {
        gl.uniform1f(uTime, (Date.now() - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush();
        gl.endFrameEXP();
      };

      const loop = (now: number) => {
        if (disposed) return;
        if (active.current && now - last > FPS_MS) {
          last = now;
          draw();
        }
        raf = requestAnimationFrame(loop);
      };

      draw();
      if (animate && !reduceMotion.current) raf = requestAnimationFrame(loop);

      cleanup.current = () => {
        disposed = true;
        cancelAnimationFrame(raf);
      };
    },
    [animate, fluteWidth, grain, strength, width],
  );

  return (
    <View
      pointerEvents="none"
      className="absolute bottom-0 left-0 right-0 top-0 bg-background"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 ? <GLView key={width} style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} /> : null}
    </View>
  );
}
