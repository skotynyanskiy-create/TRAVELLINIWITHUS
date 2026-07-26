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
import {
  ScrollControls,
  useScroll,
  Billboard,
  Float,
  Sparkles,
  useTexture,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import {
  SENTIERO_CURVE,
  SENTIERO_STAGES,
  SENTIERO_PAGES,
  BASE_THEME,
  type SentieroStage,
} from './sentieroData';

const ACCENT = '#c2410c';

/** Poster statico per un media: l'immagine stessa, o la cover del reel video. */
function posterFor(media: SentieroStage['media']): string {
  if (media.type === 'image') return media.src;
  return media.src.replace('/video/', '/images/reels/').replace('.mp4', '-cover.webp');
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Telecamera cinematografica lungo il sentiero (reversibile): damping
 *  frame-indipendente, look-ahead dinamico, parallax del puntatore e respiro
 *  organico ridotto. Tutti gli effetti "vivi" si spengono sotto prefers-reduced-motion. */
function CameraRig({ activeIndex }: { activeIndex: number }) {
  const scroll = useScroll();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(0, 0.7, 0), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  useFrame((state, dt) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const ahead = THREE.MathUtils.clamp(0.04 + Math.abs(scroll.delta) * 1.5, 0.04, 0.12);
    SENTIERO_CURVE.getPointAt(t, pos);
    SENTIERO_CURVE.getPointAt(Math.min(t + ahead, 1), look);

    // Inquadratura cinematografica: orienta lo sguardo parzialmente (25%) verso la card attiva
    // — la camera "posa" sul fotogramma invece di puntarci addosso.
    const activeStage = SENTIERO_STAGES[activeIndex];
    if (activeStage) {
      const cardPos = new THREE.Vector3(...activeStage.position);
      const dir = activeIndex % 2 === 0 ? 1 : -1;
      cardPos.x -= 0.6 * dir;
      look.lerp(cardPos, 0.25);
    }

    const time = state.clock.elapsedTime;
    // Sway ridotto: 0.05/0.03 (era 0.1/0.06) per movimento più posato
    const swayX = reduced ? 0 : Math.sin(time * 0.5) * 0.05;
    const swayY = reduced ? 0 : Math.cos(time * 0.4) * 0.03;
    const px = reduced ? 0 : state.pointer.x * 0.4;
    const py = reduced ? 0 : state.pointer.y * 0.25;

    const targetX = pos.x + swayX + px;
    const targetY = pos.y + 1.5 + swayY + py;
    const targetZ = pos.z;
    const lambda = reduced ? 7 : 4;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, lambda, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, lambda, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, lambda, dt);

    // 1. FOV Speed Warp (dynamic field of view based on scroll velocity)
    const perspectiveCamera = state.camera as THREE.PerspectiveCamera;
    if (perspectiveCamera.isPerspectiveCamera) {
      const targetFov = reduced
        ? 62
        : THREE.MathUtils.clamp(62 + Math.abs(scroll.delta) * 160, 62, 80);
      perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, targetFov, 4, dt);
      perspectiveCamera.updateProjectionMatrix();
    }

    const lookTargetY = look.y + 0.7;
    lookCurrent.x = THREE.MathUtils.damp(lookCurrent.x, look.x, lambda, dt);
    lookCurrent.y = THREE.MathUtils.damp(lookCurrent.y, lookTargetY, lambda, dt);
    lookCurrent.z = THREE.MathUtils.damp(lookCurrent.z, look.z, lambda, dt);
    state.camera.lookAt(lookCurrent);

    // 2. Camera Banking (Roll on Z axis during curve turns)
    if (!reduced) {
      const tangentCurrent = SENTIERO_CURVE.getTangentAt(t);
      const tangentNext = SENTIERO_CURVE.getTangentAt(Math.min(t + 0.02, 1));
      const turnX = tangentNext.x - tangentCurrent.x;
      const targetRoll = -turnX * 1.5 - state.pointer.x * 0.04;
      state.camera.rotation.z = THREE.MathUtils.damp(state.camera.rotation.z, targetRoll, 4, dt);
    }
  });
  return null;
}

/** Atmosfera che cambia con lo scroll: sfondo + nebbia + luce sfumano tra i
 *  temi delle tappe. È la "varie ambientazioni nella sequenza". */
function AmbianceRig({ lightRef }: { lightRef: RefObject<THREE.AmbientLight | null> }) {
  const scroll = useScroll();
  const { scene } = useThree();
  const themes = useMemo(
    () =>
      SENTIERO_STAGES.map((s) => ({
        t: s.t,
        bg: new THREE.Color(s.theme.bg),
        fog: new THREE.Color(s.theme.fog),
        light: new THREE.Color(s.theme.light),
      })),
    []
  );
  const bg = useMemo(() => new THREE.Color(BASE_THEME.bg), []);
  const fog = useMemo(() => new THREE.Color(BASE_THEME.fog), []);
  const light = useMemo(() => new THREE.Color(BASE_THEME.light), []);

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

    if (scene.background instanceof THREE.Color) scene.background.lerp(bg, 0.08);
    if (scene.fog) (scene.fog as THREE.Fog).color.lerp(fog, 0.08);
    if (lightRef.current) lightRef.current.color.lerp(light, 0.08);
  });
  return null;
}

/** Filo guida del sentiero: tubo sottile a bassa emissione che la nebbia
 *  occulta progressivamente — filo del brand, non protagonista. */
function PathRibbon() {
  const geometry = useMemo(() => new THREE.TubeGeometry(SENTIERO_CURVE, 280, 0.025, 8, false), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={ACCENT}
        emissive={ACCENT}
        emissiveIntensity={0.8}
        roughness={0.4}
        toneMapped={false}
      />
    </mesh>
  );
}

/** 6 pin terracotta posizionati a ogni tappa lungo la curva.
 *  Pulsano leggermente sul mondo attivo: sono i marker della mappa. */
function WaypointDots({ activeIndex }: { activeIndex: number }) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    SENTIERO_STAGES.forEach((_, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const isActive = i === activeIndex;
      const baseScale = isActive ? 1.5 : 1.0;
      const pulse = isActive ? Math.sin(t * 2.5) * 0.18 : 0;
      mesh.scale.setScalar(baseScale + pulse);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isActive ? 3.0 : 1.2;
    });
  });

  return (
    <>
      {SENTIERO_STAGES.map((stage, i) => {
        const pt = SENTIERO_CURVE.getPointAt(stage.t);
        return (
          <mesh
            key={stage.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            position={[pt.x, pt.y + 0.18, pt.z + 0.12]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={ACCENT}
              emissive={ACCENT}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

/** Boundary R3F: un loader fallito degrada, non crasha la scena. */
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

function NeutralPhoto({
  position = [0, 0.2, 0],
  width = 3.1,
  height = 4.1,
}: {
  position?: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      {/* self-lit: fallback scuro coerente con i piani foto/video */}
      <meshBasicMaterial color="#14110f" />
    </mesh>
  );
}

function CoverPhoto({
  src,
  position = [0, 0.2, 0],
  width = 3.1,
  height = 4.1,
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
      {/* self-lit: stessa luminosità delle tappe video — fotogramma non dipende dalla luce di scena */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

/** Reel live dentro il fotogramma 3D — montato SOLO sul mondo attivo, così
 *  decodifica un video alla volta (niente frame neri da decoder concorrenti,
 *  niente costo CWV di N reel insieme). La cover statica resta dietro come
 *  poster: se il video tarda o fallisce, si vede comunque il fotogramma.
 *
 *  Gestiamo l'elemento <video> a mano invece di useVideoTexture: drei cachea i
 *  video via suspend-react e li lascia in play anche dopo lo smontaggio del
 *  piano — quindi tutti i reel già visti continuerebbero a decodificare. Qui
 *  allo smontaggio fermiamo il video e liberiamo la texture: un solo decoder. */
function VideoPlane({
  src,
  position = [0, 0.2, 0],
  width = 3.1,
  height = 4.1,
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
    el.setAttribute('data-sentiero-reel', src.split('/').pop() ?? '');
    // Off-screen ma renderizzato (non display:none): alcuni browser non
    // scaricano/decodificano i media in display:none. 1px opacità 0 = invisibile
    // ma il decode gira a risoluzione nativa per la texture.
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

  // Cover-fit del reel 9:16 dentro il piano 3:4: ritaglia alto/basso invece di
  // stirare — combacia con l'inquadratura della cover e taglia via il watermark
  // TikTok in fondo.
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

  // Teardown StrictMode-safe: NON azzeriamo il src (la stessa istanza memoizzata
  // verrebbe rimontata morta al secondo giro di effect). Pause + remove dal DOM
  // ferma il decoder; dispose libera la GPU. Sul vero unmount / cambio mondo
  // resta così un solo reel a decodificare.
  useEffect(() => {
    document.body.appendChild(video);
    const play = video.play();
    if (play && typeof play.catch === 'function') play.catch(() => {});

    let active = true;
    let rfcId: number;
    const updateCallback = () => {
      if (!active) return;
      texture.needsUpdate = true;
      // Guard runtime: requestVideoFrameCallback manca nei browser più vecchi.
      if (video.requestVideoFrameCallback) {
        rfcId = video.requestVideoFrameCallback(updateCallback);
      }
    };

    if (video.requestVideoFrameCallback) {
      rfcId = video.requestVideoFrameCallback(updateCallback);
    }

    return () => {
      active = false;
      if (video.cancelVideoFrameCallback && rfcId) {
        video.cancelVideoFrameCallback(rfcId);
      }
      video.pause();
      video.remove();
      texture.dispose();
    };
  }, [video, texture]);

  // Finché il reel non ha un frame decodificato (readyState >= HAVE_CURRENT_DATA)
  // teniamo il piano DIETRO la cover, che lo occlude: niente fotogramma nero
  // all'ingresso del mondo. Pronto → lo portiamo davanti. Spostare position.z non
  // interferisce col clipping del StageCard (agisce su opacity/visible), quindi
  // nessun conflitto di controllo sullo stesso attributo.
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const ready = video.readyState >= 2;
    const mesh = meshRef.current;
    if (mesh) mesh.position.z = ready ? position[2] : position[2] - 0.04;
    // Fallback se requestVideoFrameCallback non è presente e il video sta riproducendo
    if (ready && !video.requestVideoFrameCallback && !video.paused) {
      texture.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** Fotogramma unificato 9:16 con passe-partout scuro e hairline accent terracotta.
 *  Stessa geometria per tutte le 6 tappe — coerenza visiva garantita.
 *  Sul mondo attivo una back-light puntiforme stacca il fotogramma dal fondo. */
// 1. Polaroid Object
function PolaroidObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  const polaroidTextTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#faf8f4';
      ctx.fillRect(0, 0, 512, 128);
      ctx.font = 'italic 52px "Segoe Print", "Bradley Hand ITC", cursive';
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Rodrigo & Betta', 256, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <>
      {/* Volumetric Polaroid Frame back */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 4.4, 0.08]} />
        <meshStandardMaterial color="#faf8f4" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Polaroid Text at the bottom */}
      <mesh position={[0, -1.3, 0.045]}>
        <planeGeometry args={[2.5, 0.625]} />
        <meshStandardMaterial
          map={polaroidTextTexture}
          transparent
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>
      {/* Polaroid Photo */}
      <R3FErrorBoundary
        fallback={<NeutralPhoto position={[0, 0.65, 0.045]} width={3.1} height={3.1} />}
      >
        <Suspense fallback={<NeutralPhoto position={[0, 0.65, 0.045]} width={3.1} height={3.1} />}>
          <CoverPhoto src={poster} position={[0, 0.65, 0.045]} width={3.1} height={3.1} />
        </Suspense>
      </R3FErrorBoundary>
      {showVideo && (
        <R3FErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <VideoPlane src={videoSrc} position={[0, 0.65, 0.05]} width={3.1} height={3.1} />
          </Suspense>
        </R3FErrorBoundary>
      )}
    </>
  );
}

// 2. Folded Map Object
function FoldedMapObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  return (
    <>
      {/* Volumetric Z-Folded map back panel left */}
      <mesh position={[-1.23, 0.2, 0.08]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 4.7, 0.04]} />
        <meshStandardMaterial color="#ebdcb9" roughness={0.9} />
      </mesh>
      {/* Volumetric Z-Folded map back panel center */}
      <mesh position={[0, 0.2, 0]} rotation={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 4.7, 0.04]} />
        <meshStandardMaterial color="#ebdcb9" roughness={0.9} />
      </mesh>
      {/* Volumetric Z-Folded map back panel right */}
      <mesh position={[1.23, 0.2, 0.08]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 4.7, 0.04]} />
        <meshStandardMaterial color="#ebdcb9" roughness={0.9} />
      </mesh>

      {/* Postcard centered on the middle panel (with rotation and thickness) */}
      <group rotation={[0, -0.15, 0]}>
        {/* Postcard volumetric border */}
        <mesh position={[0, 0.2, 0.035]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 3.1, 0.03]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Postcard photo */}
        <R3FErrorBoundary
          fallback={<NeutralPhoto position={[0, 0.2, 0.055]} width={2.2} height={2.9} />}
        >
          <Suspense fallback={<NeutralPhoto position={[0, 0.2, 0.055]} width={2.2} height={2.9} />}>
            <CoverPhoto src={poster} position={[0, 0.2, 0.055]} width={2.2} height={2.9} />
          </Suspense>
        </R3FErrorBoundary>
        {showVideo && (
          <R3FErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <VideoPlane src={videoSrc} position={[0, 0.2, 0.06]} width={2.2} height={2.9} />
            </Suspense>
          </R3FErrorBoundary>
        )}
      </group>
    </>
  );
}

// 3. Notebook Object
function NotebookObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  return (
    <>
      {/* Volumetric leather cover back */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 4.6, 0.14]} />
        <meshStandardMaterial color="#292524" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Orange vertical elastic band wrapping around the cover */}
      <mesh position={[1.45, 0.2, 0.01]} castShadow>
        <boxGeometry args={[0.08, 4.62, 0.16]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} />
      </mesh>
      {/* Photo/Reel */}
      <R3FErrorBoundary
        fallback={<NeutralPhoto position={[0, 0.2, 0.075]} width={3.1} height={4.1} />}
      >
        <Suspense fallback={<NeutralPhoto position={[0, 0.2, 0.075]} width={3.1} height={4.1} />}>
          <CoverPhoto src={poster} position={[0, 0.2, 0.075]} width={3.1} height={4.1} />
        </Suspense>
      </R3FErrorBoundary>
      {showVideo && (
        <R3FErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <VideoPlane src={videoSrc} position={[0, 0.2, 0.08]} width={3.1} height={4.1} />
          </Suspense>
        </R3FErrorBoundary>
      )}
    </>
  );
}

// 4. Smartphone Object
function SmartphoneObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  return (
    <>
      {/* Phone zinc metal frame bezel */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.45, 4.45, 0.18]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Phone screen casing body */}
      <mesh position={[0, 0.2, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 4.4, 0.1]} />
        <meshStandardMaterial color="#09090b" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Screen (Photo/Video) */}
      <R3FErrorBoundary
        fallback={<NeutralPhoto position={[0, 0.2, 0.105]} width={3.15} height={4.15} />}
      >
        <Suspense fallback={<NeutralPhoto position={[0, 0.2, 0.105]} width={3.15} height={4.15} />}>
          <CoverPhoto src={poster} position={[0, 0.2, 0.105]} width={3.15} height={4.15} />
        </Suspense>
      </R3FErrorBoundary>
      {showVideo && (
        <R3FErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <VideoPlane src={videoSrc} position={[0, 0.2, 0.11]} width={3.15} height={4.15} />
          </Suspense>
        </R3FErrorBoundary>
      )}
      {/* Dynamic Island at the top */}
      <mesh position={[0, 2.05, 0.12]}>
        <boxGeometry args={[0.8, 0.16, 0.02]} />
        <meshStandardMaterial color="#000000" roughness={0.6} />
      </mesh>
    </>
  );
}

// 5. Tickets (Boarding Passes) Object
function TicketsObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  return (
    <>
      {/* Volumetric Under ticket (Boarding pass) rotated */}
      <mesh position={[-0.2, 0.1, -0.02]} rotation={[0, 0, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 4.0, 0.03]} />
        <meshStandardMaterial color="#f2ebdb" roughness={0.8} />
      </mesh>
      {/* Subtle orange accent stripe representing ticket brand header */}
      <mesh position={[-0.2, 1.8, -0.003]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[3.0, 0.15, 0.032]} />
        <meshStandardMaterial color="#c2410c" roughness={0.8} />
      </mesh>
      {/* Volumetric Upper ticket rotated the other way */}
      <group position={[0.1, 0.2, 0.015]} rotation={[0, 0, -0.05]}>
        {/* Ticket volumetric base */}
        <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
          <boxGeometry args={[3.18, 4.18, 0.03]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Photo/Reel */}
        <R3FErrorBoundary
          fallback={<NeutralPhoto position={[0, 0, 0.03]} width={3.1} height={4.1} />}
        >
          <Suspense fallback={<NeutralPhoto position={[0, 0, 0.03]} width={3.1} height={4.1} />}>
            <CoverPhoto src={poster} position={[0, 0, 0.03]} width={3.1} height={4.1} />
          </Suspense>
        </R3FErrorBoundary>
        {showVideo && (
          <R3FErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <VideoPlane src={videoSrc} position={[0, 0, 0.035]} width={3.1} height={4.1} />
            </Suspense>
          </R3FErrorBoundary>
        )}
      </group>
    </>
  );
}

// 6. Standard Card / Fallback Object
function StandardCardObject({
  poster,
  showVideo,
  videoSrc,
}: {
  poster: string;
  showVideo: boolean;
  videoSrc: string;
}) {
  return (
    <>
      {/* Volumetric back frame */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 4.7, 0.1]} />
        <meshStandardMaterial color="#1a1512" roughness={0.85} metalness={0.15} />
      </mesh>
      {/* Volumetric terracotta accent border */}
      <mesh position={[0, 0.2, 0.02]}>
        <boxGeometry args={[3.18, 4.18, 0.08]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} />
      </mesh>
      {/* Photo/Reel */}
      <R3FErrorBoundary
        fallback={<NeutralPhoto position={[0, 0.2, 0.065]} width={3.1} height={4.1} />}
      >
        <Suspense fallback={<NeutralPhoto position={[0, 0.2, 0.065]} width={3.1} height={4.1} />}>
          <CoverPhoto src={poster} position={[0, 0.2, 0.065]} width={3.1} height={4.1} />
        </Suspense>
      </R3FErrorBoundary>
      {showVideo && (
        <R3FErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <VideoPlane src={videoSrc} position={[0, 0.2, 0.07]} width={3.1} height={4.1} />
          </Suspense>
        </R3FErrorBoundary>
      )}
    </>
  );
}

/** Fotogramma unificato 9:16 con passe-partout scuro e hairline accent terracotta.
 *  Stessa geometria per tutte le 6 tappe — coerenza visiva garantita.
 *  Sul mondo attivo una back-light puntiforme stacca il fotogramma dal fondo. */
function StageCard({ stage, isActive }: { stage: SentieroStage; isActive: boolean }) {
  const poster = posterFor(stage.media);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const showVideo = isActive && stage.media.type === 'video' && !reduced;
  const groupRef = useRef<THREE.Group | null>(null);

  // Anti-clipping: sfuma gli elementi quando la camera li supera
  useFrame((state) => {
    if (!groupRef.current) return;
    const zDist = stage.position[2] - state.camera.position.z;
    // Il mondo attivo resta sempre pieno: è il fotogramma che stai guardando.
    // Il fade "quando la camera supera la card" vale solo per gli altri mondi —
    // altrimenti su certe tappe la card attiva (la più vicina) si spegne a nero.
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
    <group ref={groupRef}>
      <Float speed={1.3} rotationIntensity={0} floatIntensity={0.5} position={stage.position}>
        <Billboard>
          {stage.id === 'chi-siamo' && (
            <PolaroidObject poster={poster} showVideo={showVideo} videoSrc={stage.media.src} />
          )}
          {stage.id === 'destinazioni' && (
            <FoldedMapObject poster={poster} showVideo={showVideo} videoSrc={stage.media.src} />
          )}
          {stage.id === 'posti' && (
            <NotebookObject poster={poster} showVideo={showVideo} videoSrc={stage.media.src} />
          )}
          {stage.id === 'community' && (
            <SmartphoneObject poster={poster} showVideo={showVideo} videoSrc={stage.media.src} />
          )}
          {stage.id === 'collaborazioni' && (
            <TicketsObject poster={poster} showVideo={showVideo} videoSrc={stage.media.src} />
          )}
          {stage.id !== 'chi-siamo' &&
            stage.id !== 'destinazioni' &&
            stage.id !== 'posti' &&
            stage.id !== 'community' &&
            stage.id !== 'collaborazioni' && (
              <StandardCardObject
                poster={poster}
                showVideo={showVideo}
                videoSrc={stage.media.src}
              />
            )}

          {/* Back-light puntiforme sul mondo attivo: rim glow senza alone-texture */}
          {isActive && (
            <pointLight
              position={[0, 0.2, -1.8]}
              color={stage.theme.light}
              intensity={0.85}
              distance={6}
              decay={2}
            />
          )}
        </Billboard>
      </Float>
    </group>
  );
}

function Stages({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      {SENTIERO_STAGES.map((stage) => (
        <StageCard key={stage.id} stage={stage} isActive={stage.index === activeIndex} />
      ))}
    </>
  );
}

function ScrollReporter({
  onActive,
  progressRef,
  endRef,
}: {
  onActive: (index: number) => void;
  progressRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
}) {
  const scroll = useScroll();
  const last = useRef(-1);
  const targetScroll = useRef<number | null>(null);
  const userScrolling = useRef(false);
  const interactionTimeout = useRef<number | null>(null);

  useEffect(() => {
    const el = scroll.el;
    if (!el) return;

    const handleInteraction = () => {
      userScrolling.current = true;
      targetScroll.current = null;
      if (interactionTimeout.current) {
        window.clearTimeout(interactionTimeout.current);
      }
      interactionTimeout.current = window.setTimeout(() => {
        userScrolling.current = false;
      }, 150);
    };

    el.addEventListener('wheel', handleInteraction, { passive: true });
    el.addEventListener('touchmove', handleInteraction, { passive: true });
    el.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleInteraction);
      el.removeEventListener('touchmove', handleInteraction);
      el.removeEventListener('keydown', handleInteraction);
      if (interactionTimeout.current) window.clearTimeout(interactionTimeout.current);
    };
  }, [scroll.el]);

  useFrame((_state, dt) => {
    const o = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    if (progressRef.current) progressRef.current.style.transform = `scaleY(${o})`;
    if (endRef.current) {
      const show = o > 0.92;
      endRef.current.style.opacity = show ? '1' : '0';
      endRef.current.style.pointerEvents = show ? 'auto' : 'none';
    }
    let idx = 0;
    let best = Infinity;
    for (let i = 0; i < SENTIERO_STAGES.length; i++) {
      const d = Math.abs(SENTIERO_STAGES[i].t - o);
      if (d < best) {
        best = d;
        idx = i;
      }
    }
    if (idx !== last.current) {
      last.current = idx;
      onActive(idx);
    }

    // Scroll snapping fluido basato su eventi fisici reali dell'utente
    const el = scroll.el;
    if (el) {
      if (userScrolling.current) {
        targetScroll.current = null;
      } else {
        if (targetScroll.current === null) {
          const snapPoints = [0, ...SENTIERO_STAGES.map((s) => s.t), 1];
          let minDiff = Infinity;
          let bestT = 0;
          snapPoints.forEach((tVal) => {
            const diff = Math.abs(tVal - o);
            if (diff < minDiff) {
              minDiff = diff;
              bestT = tVal;
            }
          });
          const maxScroll = el.scrollHeight - el.clientHeight;
          targetScroll.current = bestT * maxScroll;
        }

        if (targetScroll.current !== null) {
          const diff = targetScroll.current - el.scrollTop;
          if (Math.abs(diff) > 1.2) {
            const factor = Math.min(6 * dt, 1);
            el.scrollTop += diff * factor;
          } else {
            el.scrollTop = targetScroll.current;
          }
        }
      }
    }
  });
  return null;
}

// Hash intero → [0,1): la composizione della scena deve essere pura e riproducibile
// (react-hooks/purity, StrictMode-safe) — Math.random nel render rerollerebbe
// posizioni a ogni remount.
function seededRand(seed: number) {
  let s = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
  s ^= s >>> 16;
  return (s >>> 0) / 4294967296;
}

/** Elementi di viaggio fluttuanti nell'ambiente (Polaroid sbiadite, boarding ticket)
 *  che sfilano ai lati della camera creando un senso di parallasse e tridimensionalità. */
function EnvironmentalProps() {
  const count = 35;
  const props = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const t = i / count;
      const pt = SENTIERO_CURVE.getPointAt(t);
      const tangent = SENTIERO_CURVE.getTangentAt(t);
      const sideDir = new THREE.Vector3()
        .copy(tangent)
        .cross(new THREE.Vector3(0, 1, 0))
        .normalize();

      const rand = (k: number) => seededRand(i * 101 + k);
      const side = i % 2 === 0 ? 1 : -1;
      const offsetDistance = 4.0 + rand(0) * 7;

      const x = pt.x + sideDir.x * offsetDistance * side + (rand(1) - 0.5) * 2;
      const y = pt.y + (rand(2) - 0.5) * 4;
      const z = pt.z + sideDir.z * offsetDistance * side + (rand(3) - 0.5) * 2;

      const rot = [rand(4) * 0.8 - 0.4, rand(5) * 0.8 - 0.4, rand(6) * Math.PI] as [
        number,
        number,
        number,
      ];

      const size = 0.5 + rand(7) * 0.7;
      const type = i % 3;

      return {
        id: i,
        position: [x, y, z] as [number, number, number],
        rotation: rot,
        size,
        type,
        floatSpeed: 0.8 + rand(8) * 0.4,
      };
    });
  }, []);

  return (
    <group>
      {props.map((p) => {
        const color = p.type === 0 ? '#faf8f4' : p.type === 1 ? '#ebdcb9' : '#f2ebdb';
        return (
          <Float
            key={p.id}
            speed={p.floatSpeed}
            floatIntensity={0.6}
            rotationIntensity={0.4}
            position={p.position}
            rotation={p.rotation}
          >
            <mesh>
              <boxGeometry args={[p.size * 0.75, p.size, 0.012]} />
              <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.1} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function SentieroCanvas({
  active,
  onActive,
  progressRef,
  endRef,
}: {
  active: number;
  onActive: (index: number) => void;
  progressRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
}) {
  const lightRef = useRef<THREE.AmbientLight | null>(null);
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, zIndex: 10 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      camera={{ fov: 62, near: 0.1, far: 260, position: [0, 1.5, 6] }}
    >
      {/* Nebbia più stretta: i piani lontani si dissolvono nel buio caldo */}
      <fog attach="fog" args={[BASE_THEME.fog, 10, 65]} />
      <ambientLight ref={lightRef} intensity={0.75} color={BASE_THEME.light} />
      <directionalLight position={[8, 14, 6]} intensity={1.0} color="#ffe6c4" />
      {/* UNA sola Sparkles: polvere atmosferica contenuta, non distraente */}
      <Sparkles
        count={100}
        scale={[60, 26, 170]}
        position={[0, 5, -56]}
        size={2.5}
        speed={0.12}
        opacity={0.2}
        color={SENTIERO_STAGES[active]?.theme.sparkle ?? '#e8a866'}
      />
      <Suspense fallback={null}>
        <PathRibbon />
        <WaypointDots activeIndex={active} />
        <Stages activeIndex={active} />
        <EnvironmentalProps />
      </Suspense>
      <ScrollControls pages={SENTIERO_PAGES} damping={0.3}>
        <CameraRig activeIndex={active} />
        <AmbianceRig lightRef={lightRef} />
        <ScrollReporter onActive={onActive} progressRef={progressRef} endRef={endRef} />
      </ScrollControls>
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.2} luminanceSmoothing={0.85} mipmapBlur />
        <Vignette offset={0.32} darkness={0.95} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
