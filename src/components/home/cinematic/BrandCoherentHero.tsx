import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowDown, ArrowRight, Map, Stamp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import SchedaVerifica from '@/src/components/atlante/SchedaVerifica';
import MagneticWrapper from '@/src/components/MagneticWrapper';
import OptimizedImage from '@/src/components/OptimizedImage';
import TiltCard from '@/src/components/TiltCard';
import { getContentById } from '@/src/config/contentLibrary';

const FEATURED_POSTO_ID = 'campania-burton-juice';

const containerVariants: Variants = {
  // Il contenitore deve restare visibile al primo paint: ospita l'H1 LCP.
  // Continua a propagare lo stato `hidden` ai figli animati e il loro stagger.
  hidden: {},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

export default function BrandCoherentHero() {
  const [schedaOpen, setSchedaOpen] = useState(false);
  const featured = getContentById(FEATURED_POSTO_ID);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-[var(--color-sand,#faf7f2)] pt-24 pb-12 md:pt-20 md:pb-20 text-[var(--color-ink,#1a2b3c)] overflow-hidden border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Su mobile la fotografia sale subito sotto il titolo: apertura da
            rivista (titolo → immagine → sommario) invece di 797px di testo
            prima del primo scatto.
            Il meccanismo è il `contents` qui sotto: sotto lg il wrapper della
            colonna sinistra sparisce come box, titolo e sommario diventano
            fratelli dell'immagine e `order` li dispone attorno. Da lg in su il
            wrapper torna un blocco normale — quindi il desktop è la struttura
            originale, non una sua imitazione. */}
        <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-x-12 lg:gap-y-0">
          <div className="contents lg:block">
            {/* Left Editorial Copy with Staggered Motion */}
            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? 'visible' : 'hidden'}
              animate="visible"
              className="order-1 lg:order-none"
            >
              <motion.div
                variants={itemVariants}
                // Tinta al 5%, non al 10: con l'accento elettrico il fondo del
                // chip si scalda quel tanto che porta il terracotta sotto 4,5.
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)]/30 bg-[var(--color-accent,#c85a32)]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]"
              >
                <Sparkles size={13} />
                {/* Sotto sm il nome del sito manda il chip a capo su due righe e
                  ripete quello che il marchio in navbar dice già. */}
                Rodrigo &amp; Betta<span className="hidden sm:inline"> · Travelliniwithus</span>
              </motion.div>

              <h1 className="font-serif text-4xl font-normal leading-[1.06] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
                Posti che sembrano inventati. <br />
                <span className="italic text-[var(--color-accent,#c85a32)]">
                  Ma esistono davvero.
                </span>
              </h1>
            </motion.div>

            {/* Sommario, azioni e prove: sotto la fotografia su mobile, sotto
                il titolo nella stessa colonna su desktop. */}
            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? 'visible' : 'hidden'}
              animate="visible"
              className="order-3 lg:order-none"
            >
              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg)] sm:text-lg"
              >
                Siamo Rodrigo e Betta. Li proviamo prima di persona, poi vi diciamo se valgono
                davvero il viaggio — con prezzi reali, periodo giusto ed atmosfera.
              </motion.p>

              {/* Actions with Magnetic CTAs */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <MagneticWrapper strength={6}>
                  <a
                    href="#indice-vivo"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[var(--color-accent-hover)] cursor-pointer"
                  >
                    Apri il registro <ArrowDown size={16} />
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={4}>
                  <Link
                    to="/mappa"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] hover:text-[var(--color-accent-text)]"
                  >
                    Vai alla mappa <Map size={16} />
                  </Link>
                </MagneticWrapper>
              </motion.div>

              {/* Proof Signals */}
              {/* Le tre prove vanno a capo come unità intere: senza `flex-wrap`
                si incolonnavano strette e spezzavano «Esperienze / reali». */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-5 text-xs font-semibold text-[var(--color-muted-fg)] sm:gap-x-6"
              >
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                  Esperienze reali
                </span>
                <span aria-hidden>·</span>
                <span className="whitespace-nowrap">Costi trasparenti</span>
                <span aria-hidden>·</span>
                <span className="whitespace-nowrap">Periodo consigliato</span>
              </motion.div>

              {/* Verification Stamp Button & Drawer */}
              {featured && (
                <motion.div variants={itemVariants} className="mt-8">
                  <button
                    type="button"
                    aria-expanded={schedaOpen}
                    onClick={() => setSchedaOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent,#c85a32)] bg-[var(--color-sand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)] shadow-sm transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)] cursor-pointer"
                  >
                    <Stamp size={14} />
                    {schedaOpen ? 'Chiudi la scheda' : 'Provato — apri la scheda'}
                  </button>

                  {schedaOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-xl"
                    >
                      <SchedaVerifica item={featured} />
                      <Link
                        to={`/posto/${featured.id}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)] hover:underline"
                      >
                        Apri la scheda completa <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Tactile Cover Image with 3D Tilt Card & Entrance Reveal */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.95, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            // Fra sm e lg la colonna è larga quanto la pagina: senza tetto la
            // foto 4:5 riempirebbe da sola lo schermo del tablet e spingerebbe
            // sommario e CTA sotto la piega. Su telefono resta a piena
            // larghezza, su desktop torna a occupare la sua colonna.
            className="relative order-2 sm:mx-auto sm:max-w-sm lg:order-none lg:mx-0 lg:max-w-none"
          >
            <TiltCard maxTilt={5}>
              <div className="relative overflow-hidden rounded-[var(--radius-lg,20px)] border border-[var(--color-border)] bg-white p-3 shadow-xl">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl">
                  <OptimizedImage
                    src="/images/home-journal/hero-impossible.png"
                    alt="Betta seduta su una poltrona bianca al Burton Juice, fra scacchi giganti e specchi fioriti"
                    priority
                    responsiveWidths={[320, 480, 768]}
                    baseWidth={1080}
                    // Deve restare IDENTICO a `imagesizes` del preload in
                    // index.html. Sotto sm la foto è larga quanto il contenuto
                    // meno i padding (24+12 per lato); fra sm e lg il tetto
                    // `max-w-sm` la fissa a 360px; da lg vale la colonna.
                    sizes="(max-width: 639px) calc(100vw - 72px), (max-width: 1023px) 360px, 37vw"
                    // La sorgente è una copertina da reel 9:16 con il titolo
                    // stampato sopra. In un riquadro 4:5 il centro esatto
                    // tranciava quella scritta a metà («IM BURTON?»): l'ancora
                    // in basso la esclude e lascia la fotografia. Il titolo è
                    // già scritto sotto, in Fraunces, come didascalia.
                    className="h-full w-full object-cover [object-position:50%_88%] transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-serif italic text-[var(--color-muted-fg)]">
                  The Burton Juice · Somma Vesuviana
                </p>
              </div>
            </TiltCard>

            {/* Handwritten Note Sticker with pop reveal */}
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, y: 15 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
              className="absolute bottom-12 -left-6 max-w-xs rotate-[-3deg] rounded-2xl border border-[var(--color-border)] bg-[var(--color-sand,#faf7f2)] p-4 shadow-lg"
            >
              <p className="font-serif text-sm italic leading-snug text-[var(--color-ink)]">
                "La strada giusta non è quella più breve."
              </p>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                — Rodrigo &amp; Betta
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
