import * as THREE from 'three';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uWind;
  varying vec2 vUv;
  varying float vBillow;

  void main() {
    vUv = uv;
    vec3 p = position;
    float w1 = sin(p.x * 2.1 + uTime * 0.7) * cos(p.y * 1.7 + uTime * 0.45);
    float w2 = sin(p.x * 5.3 - uTime * 1.1) * sin(p.y * 4.1 + uTime * 0.8);
    float billow = (w1 * 0.7 + w2 * 0.3) * uWind;
    p.z += billow * 0.18;
    vBillow = billow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uLightPos;
  uniform vec3 uLightColor;
  uniform float uIntensity;
  uniform float uWind;
  uniform float uAspect;
  uniform sampler2D uTitleTex;
  uniform float uHasTitle;
  varying vec2 vUv;
  varying float vBillow;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  // one thread band: bright core, dark gap between threads (per-thread jitter)
  float thread(float coord, float count, float seed) {
    float id = floor(coord * count);
    float j = hash(vec2(id, seed)) * 0.35;
    float f = fract(coord * count + j);
    return smoothstep(0.0, 0.32, f) * smoothstep(1.0, 0.68, f);
  }

  void main() {
    vec2 uv = vUv;
    vec2 suv = vec2(uv.x * uAspect, uv.y);

    // weave: warp x weft, anisotropic — the linen identity, not fbm
    float warp = thread(uv.x + vBillow * 0.02, 220.0, 3.7);
    float weft = thread(uv.y + vBillow * 0.015, 180.0, 9.2);
    float weave = warp * 0.55 + weft * 0.45;

    // flying fibers: gradient noise stretched ~20:1
    float fibers = noise(vec2(suv.x * 3.0, suv.y * 60.0) + uTime * 0.05) * 0.12;
    // slub clumps of handmade linen
    float slub = noise(suv * 8.0) * 0.5 + noise(suv * 23.0) * 0.25;

    float thickness = 0.55 + slub * 0.5 - weave * 0.35 + fibers;
    if (uHasTitle > 0.5) {
      thickness += texture2D(uTitleTex, uv).r * 0.85; // Fraunces blocks the sun
    }

    // backlight: soft sun disc BEHIND the cloth
    vec2 lp = vec2(uLightPos.x * uAspect, uLightPos.y);
    float d = distance(suv, lp * 0.5 + vec2(uAspect * 0.5, 0.5));
    float sun = exp(-d * d * 5.5);
    float backlight = (sun * 1.15 + 0.22) * uIntensity;

    float trans = exp(-thickness * 2.1);
    vec3 lightThrough = uLightColor * backlight * trans;
    float gap = 1.0 - weave;
    lightThrough += uLightColor * sun * gap * gap * 0.55 * uIntensity; // sparkle in gaps

    vec3 sand = vec3(0.98, 0.972, 0.955);
    vec3 ink = vec3(0.11, 0.10, 0.09);
    vec3 cloth = mix(ink, sand, 0.25 + trans * 0.75);
    vec3 col = cloth * 0.35 + lightThrough;

    float vig = smoothstep(1.25, 0.45, distance(uv, vec2(0.5)));
    col *= 0.75 + vig * 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createLinenMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uLightPos: { value: new THREE.Vector2(-0.6, 0.15) },
      uLightColor: { value: new THREE.Color(0.98, 0.62, 0.55) },
      uIntensity: { value: 1 },
      uWind: { value: 0.15 },
      uTitleTex: { value: null },
      uHasTitle: { value: 0 },
      uAspect: { value: 16 / 9 },
    },
  });
}
