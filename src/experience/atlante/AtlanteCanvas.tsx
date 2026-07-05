import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Sparkles, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ATLANTE_CURVE, ATLANTE_WAYPOINTS, type AtlanteWaypoint } from './atlanteData';

const ACCENT = '#c2410c';

function posterFor(media: AtlanteWaypoint['media']): string {
  if (media.type === 'image') return media.src;
  return media.src.replace('/video/', '/images/reels/').replace('.mp4', '-cover.webp');
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// CameraRig controls camera movement along spline based on scroll progress
function CameraRig({ activeIndex }: { activeIndex: number }) {
  const scroll = useScroll();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((state, dt) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const ahead = THREE.MathUtils.clamp(0.04 + Math.abs(scroll.delta) * 1.5, 0.04, 0.12);
    ATLANTE_CURVE.getPointAt(t, pos);
    ATLANTE_CURVE.getPointAt(Math.min(t + ahead, 1), look);

    // Look slightly towards active waypoint diorama
    const activeWaypoint = ATLANTE_WAYPOINTS[activeIndex];
    if (activeWaypoint) {
      const cardPos = new THREE.Vector3(...activeWaypoint.position);
      const dir = activeIndex % 2 === 0 ? 1 : -1;
      cardPos.x -= 0.5 * dir;
      look.lerp(cardPos, 0.22);
    }

    const time = state.clock.elapsedTime;
    const swayX = reduced ? 0 : Math.sin(time * 0.5) * 0.04;
    const swayY = reduced ? 0 : Math.cos(time * 0.4) * 0.02;
    const px = reduced ? 0 : state.pointer.x * 0.35;
    const py = reduced ? 0 : state.pointer.y * 0.22;

    const targetX = pos.x + swayX + px;
    const targetY = pos.y + 1.2 + swayY + py;
    const targetZ = pos.z;
    const lambda = reduced ? 8 : 5;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, lambda, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, lambda, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, lambda, dt);

    const lookTargetY = look.y + 0.5;
    lookCurrent.x = THREE.MathUtils.damp(lookCurrent.x, look.x, lambda, dt);
    lookCurrent.y = THREE.MathUtils.damp(lookCurrent.y, lookTargetY, lambda, dt);
    lookCurrent.z = THREE.MathUtils.damp(lookCurrent.z, look.z, lambda, dt);
    state.camera.lookAt(lookCurrent);
  });
  return null;
}

// AmbianceRig blends lights and fog based on scroll progress
function AmbianceRig({ lightRef }: { lightRef: RefObject<THREE.AmbientLight | null> }) {
  const scroll = useScroll();
  const { scene } = useThree();
  const themes = useMemo(
    () =>
      ATLANTE_WAYPOINTS.map((s) => ({
        t: s.t,
        bg: new THREE.Color(s.theme.bg),
        fog: new THREE.Color(s.theme.fog),
        light: new THREE.Color(s.theme.light),
      })),
    []
  );

  const bg = useMemo(() => new THREE.Color(themes[0].bg), [themes]);
  const fog = useMemo(() => new THREE.Color(themes[0].fog), [themes]);
  const light = useMemo(() => new THREE.Color(themes[0].light), [themes]);

  useFrame(() => {
    const o = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const last = themes.length - 1;
    let a = themes[0];
    let b = themes[0];

    if (o <= themes[0].t) {
      a = b = themes[0];
    } else if (o >= themes[last].t) {
      a = b = themes[last];
    } else {
      for (let i = 0; i < last; i++) {
        if (o >= themes[i].t && o <= themes[i + 1].t) {
          a = themes[i];
          b = themes[i + 1];
          break;
        }
      }
    }

    const span = b.t - a.t;
    const f = span > 0.0001 ? (o - a.t) / span : 0;
    bg.copy(a.bg).lerp(b.bg, f);
    fog.copy(a.fog).lerp(b.fog, f);
    light.copy(a.light).lerp(b.light, f);

    if (scene.background instanceof THREE.Color) scene.background.lerp(bg, 0.06);
    if (scene.fog) (scene.fog as THREE.Fog).color.lerp(fog, 0.06);
    if (lightRef.current) lightRef.current.color.lerp(light, 0.06);
  });
  return null;
}

// Glowing spline ribbon
function PathRibbon() {
  const geometry = useMemo(() => new THREE.TubeGeometry(ATLANTE_CURVE, 240, 0.02, 6, false), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={ACCENT}
        emissive={ACCENT}
        emissiveIntensity={0.6}
        roughness={0.5}
        toneMapped={false}
      />
    </mesh>
  );
}

function CoverPhoto({
  src,
  position = [0, 0, 0],
  width = 3.0,
  height = 4.0,
}: {
  src: string;
  position?: [number, number, number];
  width?: number;
  height?: number;
}) {
  const texture = useTexture(src);
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Video plane with explicit garbage collection and single-decoder performance
function VideoPlane({
  src,
  position = [0, 0, 0],
  width = 3.0,
  height = 4.0,
}: {
  src: string;
  position?: [number, number, number];
  width?: number;
  height?: number;
}) {
  const video = useMemo(() => {
    const el = document.createElement('video');
    el.src = src;
    el.crossOrigin = 'anonymous';
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.preload = 'auto';
    Object.assign(el.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      opacity: '0',
      pointerEvents: 'none',
    });
    return el;
  }, [src]);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    t.center.set(0.5, 0.5);
    const planeAspect = width / height;
    const videoAspect = 9 / 16;
    if (videoAspect < planeAspect) {
      const r = videoAspect / planeAspect;
      t.repeat.set(1, r);
      t.offset.set(0, (1 - r) / 2);
    } else {
      const r = planeAspect / videoAspect;
      t.repeat.set(r, 1);
      t.offset.set((1 - r) / 2, 0);
    }
    return t;
  }, [video, width, height]);

  useEffect(() => {
    document.body.appendChild(video);
    const play = video.play();
    if (play && typeof play.catch === 'function') play.catch(() => {});
    return () => {
      video.pause();
      video.remove();
      texture.dispose();
    };
  }, [video, texture]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const ready = video.readyState >= 2;
    const mesh = meshRef.current;
    if (mesh) mesh.position.z = ready ? position[2] : position[2] - 0.04;
    if (ready) texture.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// 3D Portal Diorama wrapper representing a Waypoint
function StageCard({ stage, isActive }: { stage: AtlanteWaypoint; isActive: boolean }) {
  const poster = posterFor(stage.media);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const showVideo = isActive && stage.media.type === 'video' && !reduced;
  const groupRef = useRef<THREE.Group | null>(null);

  // Anti-clipping opacity fading
  useFrame((state) => {
    if (!groupRef.current) return;
    const zDist = stage.position[2] - state.camera.position.z;
    let targetOpacity = 1;
    if (!isActive) {
      if (zDist > -1.5) {
        targetOpacity = 0;
      } else if (zDist > -4.5) {
        targetOpacity = THREE.MathUtils.clamp((zDist + 4.5) / 3.0, 0, 1);
      }
    }
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material | THREE.Material[];
        if (mat) {
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              m.transparent = targetOpacity < 1;
              m.opacity = targetOpacity;
            });
          } else {
            mat.transparent = targetOpacity < 1;
            mat.opacity = targetOpacity;
          }
          mesh.visible = targetOpacity > 0;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={stage.position}>
      {/* 3D frame border / Passe-partout */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[3.2, 4.2]} />
        <meshBasicMaterial color="#0b0805" />
      </mesh>

      {/* Hairline terracotta outline */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.04, 4.04]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>

      {/* Static image cover always mounted as backdrop/poster */}
      <Suspense fallback={null}>
        <CoverPhoto src={poster} />
      </Suspense>

      {/* Dynamic video mounted only when active stage */}
      {showVideo && (
        <Suspense fallback={null}>
          <VideoPlane src={stage.media.src} />
        </Suspense>
      )}

      {/* Atmospheric sparkles specific to stage theme */}
      {isActive && (
        <Sparkles count={35} scale={5} size={1.5} speed={0.4} color={stage.theme.sparkle} />
      )}
    </group>
  );
}

class R3FErrorBoundary extends Component<
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

// Canvas Inner Dispatcher reporting scroll position to HUD
function AtlanteCanvasInner({
  onScroll,
  onActiveIndex,
}: {
  onScroll: (progress: number) => void;
  onActiveIndex: (index: number) => void;
}) {
  const scroll = useScroll();
  const lightRef = useRef<THREE.AmbientLight | null>(null);

  useFrame(() => {
    onScroll(THREE.MathUtils.clamp(scroll.offset, 0, 1));

    // Determine active index based on thresholds
    const offset = scroll.offset;
    const len = ATLANTE_WAYPOINTS.length;
    let active = 0;

    for (let i = 0; i < len; i++) {
      const stage = ATLANTE_WAYPOINTS[i];
      const nextStage = ATLANTE_WAYPOINTS[i + 1];
      const currentThreshold = stage.t;
      const nextThreshold = nextStage ? nextStage.t : 1.0;
      const mid = (currentThreshold + nextThreshold) / 2;

      if (offset >= (i === 0 ? 0 : mid) && offset < (nextStage ? (mid + nextThreshold) / 2 : 1.1)) {
        active = i;
      }
    }

    // Safe bounds
    active = Math.max(0, Math.min(len - 1, active));
    onActiveIndex(active);
  });

  return (
    <>
      <ambientLight ref={lightRef} intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />

      <PathRibbon />
      {/* AmbianceRig vive qui perché ha bisogno del ref reale della luce
          ambientale; nel parent riceveva un ref sempre null (no-op). */}
      <AmbianceRig lightRef={lightRef} />
    </>
  );
}

export default function AtlanteCanvas({
  activeIndex,
  onScroll,
  onActiveIndex,
}: {
  activeIndex: number;
  onScroll: (progress: number) => void;
  onActiveIndex: (index: number) => void;
}) {
  const initialTheme = ATLANTE_WAYPOINTS[0].theme;

  return (
    <div className="relative h-full w-full bg-[#0b0805]">
      <R3FErrorBoundary
        fallback={
          <div className="h-full w-full flex items-center justify-center text-white/50">
            Caricamento fallito
          </div>
        }
      >
        <Canvas
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          camera={{ fov: 50, near: 0.1, far: 80, position: [0, 1.2, 8] }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color(initialTheme.bg);
            scene.fog = new THREE.FogExp2(initialTheme.fog, 0.012);
          }}
        >
          <ScrollControls pages={9} distance={1.2} damping={0.3} infinite={false}>
            <Suspense fallback={null}>
              <AtlanteCanvasInner onScroll={onScroll} onActiveIndex={onActiveIndex} />

              {/* Dynamic Stage Dioramas mapping */}
              {ATLANTE_WAYPOINTS.map((stage, i) => (
                <StageCard key={stage.id} stage={stage} isActive={i === activeIndex} />
              ))}

              <CameraRig activeIndex={activeIndex} />
            </Suspense>
          </ScrollControls>

          <EffectComposer>
            <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.3} height={300} intensity={0.4} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <Noise opacity={0.015} />
          </EffectComposer>
        </Canvas>
      </R3FErrorBoundary>
    </div>
  );
}
