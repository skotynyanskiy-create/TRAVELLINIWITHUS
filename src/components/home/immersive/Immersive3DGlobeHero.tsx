import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';
import { motion } from 'motion/react';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import CursorSpotlightCanvas from './CursorSpotlightCanvas';
import Button from '@/src/components/Button';

function AnimatedGlobeMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
  });

  return (
    <Sphere ref={meshRef} args={[2.2, 64, 64]} scale={1.2}>
      <MeshDistortMaterial
        color="#c85a32"
        attach="material"
        distort={0.25}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        wireframe={true}
      />
    </Sphere>
  );
}

export default function Immersive3DGlobeHero() {
  return (
    <section className="relative w-full min-h-[92svh] overflow-hidden bg-[var(--color-ink-deep,#0b0805)] text-white">
      {/* Ambient Mouse Spotlight Canvas */}
      <CursorSpotlightCanvas />

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} color="#d4af37" intensity={2} />
          <Suspense fallback={null}>
            <AnimatedGlobeMesh />
          </Suspense>
        </Canvas>
      </div>

      {/* Editorial Scrim Gradient */}
      <div className="twu-hero-scrim pointer-events-none absolute inset-0 z-[5]" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-6 py-16 md:px-12">
        <div className="max-w-3xl">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-sand,#faf7f2)] backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[var(--color-accent,#c85a32)]" />
            Esperienza 3D Immersiva · Rodrigo &amp; Betta
          </motion.div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl font-normal leading-[1.04] text-[var(--color-sand,#faf7f2)] sm:text-6xl lg:text-7xl">
            Posti particolari <br />
            <span className="italic text-[var(--color-accent,#c85a32)]">
              sciolti nel bello reale.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Guida d'autore per coppie ed esploratori. Visitiamo di persona hotel di charme, borghi
            segreti e ristoranti d'atmosfera con costi veri e dettagli trasparenti.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="cta"
              size="lg"
              to="/esplora"
              magnetic
              trackingId="immersive_hero_esplora"
            >
              <Compass size={18} className="mr-2" />
              Esplora l'Atlante 3D
            </Button>
            <Button variant="outline-light" size="lg" to="/mappa" trackingId="immersive_hero_mappa">
              Apri la Mappa Interattiva
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>

          {/* Location Pins Live Bar */}
          <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 text-xs text-white/75">
            <span className="font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Destinazioni In Evidenza:
            </span>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[var(--color-accent)]" />
              <span>Volterra</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[var(--color-accent)]" />
              <span>Val d'Itria</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[var(--color-accent)]" />
              <span>Lofoten</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
