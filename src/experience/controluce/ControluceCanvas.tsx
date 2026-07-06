import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { getActAt, getLightAt } from './acts';
import { createLinenMaterial } from './LinenMaterial';
import { makeTitleTexture } from './titleTexture';

function LinenPlane({ tRef }: { tRef: MutableRefObject<number> }) {
  const material = useMemo(() => createLinenMaterial(), []);
  const { viewport } = useThree();
  const titleCache = useRef(new Map<string, THREE.CanvasTexture>());
  const lastActId = useRef('');

  useFrame(({ clock }) => {
    const t = tRef.current;
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uScroll.value = t;
    u.uAspect.value = viewport.aspect;

    const light = getLightAt(t);
    (u.uLightPos.value as THREE.Vector2).set(light.x, light.y);
    (u.uLightColor.value as THREE.Color).setRGB(light.color[0], light.color[1], light.color[2]);
    u.uIntensity.value = light.intensity;
    u.uWind.value = light.wind;

    const { act, local } = getActAt(t);
    if (act.id !== lastActId.current) {
      lastActId.current = act.id;
      if (!titleCache.current.has(act.id)) {
        titleCache.current.set(act.id, makeTitleTexture(act.title, viewport.aspect));
      }
      u.uTitleTex.value = titleCache.current.get(act.id)!;
    }
    // title pressed only in the act's middle band, absent at the seams
    const ramp = Math.min(1, Math.max(0, Math.min(local * 4, (1 - local) * 4)));
    u.uHasTitle.value = ramp > 0.05 ? 1 : 0;
  });

  return (
    <mesh material={material}>
      <planeGeometry args={[2.2, 2.2, 128, 128]} />
    </mesh>
  );
}

export default function ControluceCanvas({ tRef }: { tRef: MutableRefObject<number> }) {
  // perf guardrail: stop the frameloop entirely when the tab is hidden
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const caOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1.1], fov: 60 }}
        frameloop={frameloop}
      >
        <LinenPlane tRef={tRef} />
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.55} mipmapBlur />
          <Noise premultiply opacity={0.5} />
          <ChromaticAberration offset={caOffset} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
