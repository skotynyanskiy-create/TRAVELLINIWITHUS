import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

const COLOR_BG = '#0b0805';
const COLOR_FOG = '#0b0805';
const COLOR_CORE = new THREE.Color('#fff1df');
const COLOR_GLOW = new THREE.Color('#e8743a');

// Spline ascendente: la "traccia" sale e serpeggia. È il soggetto della scena.
const CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, -6.2, 0),
    new THREE.Vector3(-2.3, -4.2, 0.6),
    new THREE.Vector3(2.1, -1.9, -0.5),
    new THREE.Vector3(-1.7, 0.3, 0.7),
    new THREE.Vector3(1.9, 2.6, -0.6),
    new THREE.Vector3(-0.9, 4.4, 0.4),
    new THREE.Vector3(0.5, 6.3, 0),
  ],
  false,
  'catmullrom',
  0.5
);

const PIN_PARAMS = [0.0, 0.2, 0.42, 0.64, 0.84, 1.0];

function radialTexture(): THREE.Texture {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,228,196,0.65)');
  g.addColorStop(1, 'rgba(255,228,196,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPulse;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aU;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    vec3 p = position;
    float t = uTime;
    // shimmer leggero, niente deriva: la traccia resta forma
    p.x += sin(t * 0.6 + aSeed * 6.2831) * 0.018;
    p.y += cos(t * 0.5 + aSeed * 6.2831) * 0.018;

    // reveal: la traccia si disegna man mano che uProgress sale
    float edge = smoothstep(uProgress, uProgress - 0.05, aU);

    // impulso di luce che percorre la traccia
    float d = abs(aU - uPulse);
    float pulse = exp(-d * d * 320.0);
    vGlow = pulse;

    float tw = 0.55 + 0.45 * sin(t * 2.0 + aSeed * 30.0);
    vAlpha = edge * (0.32 * tw + pulse * 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = aSize * uSize * (1.0 + pulse * 2.2);
    gl_PointSize = size * uPixelRatio * (12.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColorCore;
  uniform vec3 uColorGlow;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float disc = smoothstep(0.5, 0.0, r);
    float core = smoothstep(0.32, 0.0, r);
    vec3 col = mix(uColorGlow, uColorCore, core * 0.7 + vGlow * 0.5);
    float a = disc * vAlpha;
    if (a < 0.012) discard;
    gl_FragColor = vec4(col * (1.0 + vGlow * 1.6), a);
  }
`;

function buildTrail(count: number) {
  const seg = 600;
  const frames = CURVE.computeFrenetFrames(seg, false);
  const positions = new Float32Array(count * 3);
  const aU = new Float32Array(count);
  const aSize = new Float32Array(count);
  const aSeed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const pt = CURVE.getPoint(t);
    const fi = Math.min(seg, Math.round(t * seg));
    const n = frames.normals[fi];
    const b = frames.binormals[fi];
    const ang = Math.random() * Math.PI * 2;
    // cordone sottile con alone: distribuzione concentrata + coda
    const rr =
      Math.pow(Math.random(), 1.7) * 0.2 + (Math.random() < 0.12 ? Math.random() * 0.35 : 0);
    positions[i * 3] = pt.x + (Math.cos(ang) * n.x + Math.sin(ang) * b.x) * rr;
    positions[i * 3 + 1] = pt.y + (Math.cos(ang) * n.y + Math.sin(ang) * b.y) * rr;
    positions[i * 3 + 2] = pt.z + (Math.cos(ang) * n.z + Math.sin(ang) * b.z) * rr;
    aU[i] = t;
    aSize[i] = 0.5 + Math.random() * 1.8;
    aSeed[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  return geo;
}

function Scene({ animate, lowPower }: { animate: boolean; lowPower: boolean }) {
  const { viewport } = useThree();
  const count = lowPower ? 6000 : 16000;

  const glow = useMemo(() => radialTexture(), []);

  const { geometry, material } = useMemo(() => {
    const geometry = buildTrail(count);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: animate ? 0 : 1 },
        uPulse: { value: animate ? 0 : -1 },
        uSize: { value: 3.2 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColorCore: { value: COLOR_CORE },
        uColorGlow: { value: COLOR_GLOW },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    return { geometry, material };
  }, [count, animate]);

  const points = useMemo(() => new THREE.Points(geometry, material), [geometry, material]);

  const pins = useMemo(
    () =>
      PIN_PARAMS.map((u) => {
        const pos = CURVE.getPoint(u);
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glow,
            color: new THREE.Color('#f0a06a'),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            opacity: 0,
          })
        );
        sprite.position.copy(pos);
        sprite.scale.setScalar(0.6);
        return { u, pos, sprite };
      }),
    [glow]
  );

  const group = useMemo(() => {
    const g = new THREE.Group();
    pins.forEach((p) => g.add(p.sprite));
    return g;
  }, [pins]);

  const camTarget = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame((state, dt) => {
    const u = material.uniforms;
    u.uTime.value += dt;

    if (animate) {
      // reveal una volta sola, poi resta disegnata
      u.uProgress.value = THREE.MathUtils.damp(u.uProgress.value, 1.02, 0.7, dt);
      // impulso di luce in loop lungo la traccia
      u.uPulse.value = (u.uTime.value * 0.16) % 1.0;
    }

    const prog = Math.min(u.uProgress.value, 1);
    pins.forEach((p) => {
      const lit = THREE.MathUtils.clamp((prog - p.u) * 12, 0, 1);
      const mat = p.sprite.material as THREE.SpriteMaterial;
      const pulseNear = animate ? Math.exp(-Math.pow(u.uPulse.value - p.u, 2) * 320) : 0;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, lit * (0.5 + pulseNear * 0.9), 6, dt);
      p.sprite.scale.setScalar(0.5 + lit * 0.25 + pulseNear * 0.5);
    });

    // camera: lentissima deriva + parallax mouse
    const t = state.clock.elapsedTime;
    const px = animate ? state.pointer.x * 0.6 : 0;
    const py = animate ? state.pointer.y * 0.4 : 0;
    const tx = Math.sin(t * 0.08) * 1.1 + px;
    const ty = 0.2 + py;
    const tz = 12 + Math.cos(t * 0.06) * 0.6;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, tx, 1.2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, ty, 1.2, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, tz, 1.2, dt);
    state.camera.lookAt(camTarget.current);
    void viewport;
  });

  return (
    <>
      <primitive object={points} />
      <primitive object={group} />
      {/* alone caldo di profondità dietro la traccia */}
      <sprite position={[0, 0, -4]} scale={[9, 11, 1]}>
        <spriteMaterial
          map={glow}
          color={'#2a160b'}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.28}
        />
      </sprite>
    </>
  );
}

class GLBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function TraceSignature({
  animate = true,
  lowPower = false,
}: {
  animate?: boolean;
  lowPower?: boolean;
}) {
  // Pausa il render loop quando l'hero esce dal viewport: niente postprocessing
  // full-frame (Bloom/Vignette/Noise) su un canvas invisibile. Riprende ~200px
  // prima del rientro così lo scroll-back non mostra un frame congelato.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '200px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrapRef} className="absolute inset-0" style={{ background: COLOR_BG }}>
      <GLBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center text-white/40">
            Anteprima non disponibile su questo dispositivo.
          </div>
        }
      >
        <Canvas
          frameloop={onScreen ? 'always' : 'never'}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          camera={{ fov: 48, near: 0.1, far: 60, position: [0, 0.2, 12] }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color(COLOR_BG);
            scene.fog = new THREE.FogExp2(COLOR_FOG, 0.05);
          }}
        >
          <Scene animate={animate} lowPower={lowPower} />
          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.3}
              mipmapBlur
              radius={0.5}
            />
            <Vignette eskil={false} offset={0.2} darkness={1.1} />
            <Noise opacity={lowPower ? 0 : 0.018} />
          </EffectComposer>
        </Canvas>
      </GLBoundary>
    </div>
  );
}
