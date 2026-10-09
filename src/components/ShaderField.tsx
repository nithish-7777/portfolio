"use client";

import { useEffect, useRef } from "react";

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Slow liquid colour made from layered noise that folds back on itself.
// The cursor sends a ripple through it and leaves a soft glow.
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float d = length(p - m);
  p += normalize(p - m + 0.0001) * 0.09 * exp(-d * 3.5) * sin(d * 20.0 - uTime * 3.0);

  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.5 + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
                fbm(p * 1.5 + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.5 + 3.5 * r);

  vec3 bg = vec3(0.039, 0.039, 0.035);
  vec3 lime = vec3(0.80, 0.96, 0.27);
  vec3 hot = vec3(1.0, 0.30, 0.12);
  vec3 blue = vec3(0.27, 0.43, 1.0);

  vec3 col = bg;
  col = mix(col, blue * 0.55, smoothstep(0.35, 0.90, f) * 0.6);
  col = mix(col, hot * 0.6, smoothstep(0.55, 0.98, r.x) * 0.42);
  col = mix(col, lime * 0.6, smoothstep(0.42, 0.72, q.y * f * 1.9) * 0.26);
  col = mix(bg, col, 0.9);
  col += lime * 0.14 * exp(-d * 5.0);

  col *= 0.5 + 0.5 * smoothstep(1.3, 0.2, length(p));
  col = mix(bg, col, smoothstep(0.0, 0.4, uv.y));
  gl_FragColor = vec4(col, 1.0);
}`;

/** Hero background rendered on the graphics card. Falls back to nothing if WebGL is unavailable. */
export function ShaderField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The pattern is soft, so it can be drawn small and stretched. Phones draw fewer pixels at half the rate.
    const light = window.matchMedia("(pointer: coarse)").matches;
    const scale = light ? 0.35 : 0.7;
    const target = { x: 0.5, y: 0.6 };
    const mouse = { x: 0.5, y: 0.6 };
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    canvas.dataset.ready = "true";

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduce) draw(0);
    };

    const draw = (now: number) => {
      if (light && !reduce && now - lastFrame < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduce) raf = requestAnimationFrame(draw);
    });
    const sizer = new ResizeObserver(resize);

    resize();
    raf = requestAnimationFrame(draw);
    observer.observe(canvas);
    sizer.observe(canvas);
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="shader-field absolute inset-0 h-full w-full" />;
}
