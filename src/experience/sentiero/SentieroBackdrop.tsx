import { AnimatePresence, motion } from 'motion/react';
import { SENTIERO_STAGES, type SentieroStage } from './sentieroData';

function posterFor(media: SentieroStage['media']): string {
  if (media.type === 'image') return media.src;
  return media.src.replace('/video/', '/images/reels/').replace('.mp4', '-cover.webp');
}

/**
 * Sfondo immersivo del Sentiero: il reel/foto reale del mondo attivo a tutto
 * schermo, dietro la scena 3D. Cambia in crossfade allo scroll tra i vari paesi
 * (Mar Rosso, Malesia, Toscana...), con un lento push-in (Ken Burns). Lo scrim
 * sopra tiene leggibili traccia, polaroid e HUD: lo sfondo resta atmosfera, non
 * compete col contenuto in primo piano.
 */
export default function SentieroBackdrop({ active }: { active: number }) {
  const stage = SENTIERO_STAGES[active] ?? SENTIERO_STAGES[0];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0b0805]">
      <AnimatePresence mode="sync">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, scale: 1.22 }}
          animate={{ opacity: 1, scale: 1.14 }}
          exit={{ opacity: 0, scale: 1.14 }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeInOut' },
            scale: { duration: 12, ease: 'linear' },
          }}
          className="absolute inset-0"
          // Blur + grade: il reel verticale (con testo/UI) diventa atmosfera
          // morbida di colore e movimento, non un video busy in primo piano.
          style={{ filter: 'blur(28px) brightness(0.45) saturate(0.4)' }}
        >
          <img src={posterFor(stage.media)} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Scrim: base scura uniforme + sfumatura piu' densa a sinistra, dove vive
          il testo dell'HUD. A destra lo sfondo respira e si vede il mondo. */}
      {/* Scrim rinforzato a sinistra: il testo HUD vive senza box di sfondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0805] via-[#0b0805]/82 to-[#0b0805]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0805] via-transparent to-[#0b0805]/45" />
    </div>
  );
}
