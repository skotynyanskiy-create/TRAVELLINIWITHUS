import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowDown, ArrowRight, Map, Stamp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import SchedaVerifica from '@/src/components/atlante/SchedaVerifica';
import MagneticWrapper from '@/src/components/MagneticWrapper';
import OptimizedImage from '@/src/components/OptimizedImage';
import TiltCard from '@/src/components/TiltCard';
import { CONTENT_ITEMS, getContentById } from '@/src/config/contentLibrary';
import { getReelForPosto } from '@/src/config/reels';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import { aMeseAnno } from '@/src/utils/format';

/**
 * Il posto in copertina — e la sua fotografia.
 *
 * Era `campania-burton-juice` sopra `home-journal/hero-impossible.png`. Nessuno
 * dei due reggeva la parola «Provato» stampata sul timbro qui sotto: quel posto
 * è `isPlaceholder`, è `adv`, non ha cover né prezzo, e quell'immagine è fra i
 * quattro asset a provenienza **non certificata** di
 * `DECISION_IMAGERY_TRUTH_RULE_2026-07-22` — che vieta esplicitamente di
 * adottarli come prova su una nuova superficie. La rivendicazione più visibile
 * del sito era la meno verificata.
 *
 * Ora la copertina è un posto reale, senza collaborazione, con prezzo pubblico
 * e con il frame del reel che ci abbiamo girato: la foto, la didascalia, il
 * timbro e la scheda parlano della stessa cosa vera.
 * `BrandCoherentHero.prova.test.tsx` blocca la regressione, preload incluso.
 */
const FEATURED_POSTO_ID = 'jesolo-caribe-bay';

/** Registro alla mano: i numeri della barra prove non si scrivono, si contano. */
const POSTI_PROVATI = CONTENT_ITEMS.filter((item) => !item.isPlaceholder);
const CON_COLLABORAZIONE = POSTI_PROVATI.filter(
  (item) => item.partnership.kind !== 'organic'
).length;

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
  const featuredDisclosure = featured ? PARTNERSHIP_LABEL[featured.partnership.kind] : '';
  const featuredCaption = featured
    ? [featured.place.name, featured.place.city ?? featured.place.region]
        .filter(Boolean)
        .join(' · ')
    : '';
  // La data del reel è la data della visita: è l'unica cronologia che il
  // progetto ha, ed è popolata su tutte e 29 le schede reali (stessa regola di
  // SchedaVerifica).
  const featuredQuando = aMeseAnno(
    featured ? (getReelForPosto(featured.id)?.publishedAt ?? featured.publishedAt) : undefined
  );
  const featuredNota = [
    featured?.value?.price,
    featuredQuando ? `ci siamo stati ${featuredQuando}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="relative w-full bg-[var(--color-sand,#faf7f2)] pt-28 pb-12 md:pb-20 text-[var(--color-ink,#1a2b3c)] overflow-hidden border-b border-[var(--color-border)]">
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
              {/* «Periodo giusto» prometteva un dato che nessuna scheda ha: il
                  modello non porta un periodo consigliato. Al suo posto le tre
                  cose che una scheda dà davvero — il reel girato lì, il costo
                  quando lo conosciamo, e sempre a che titolo ci siamo andati. */}
              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted-fg)] sm:text-lg"
              >
                Siamo Rodrigo e Betta. Prima ci andiamo, poi qui trovate il reel girato sul posto,
                il costo quando lo conosciamo e sempre a che titolo ci siamo andati.
              </motion.p>

              {/* Actions with Magnetic CTAs */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <MagneticWrapper strength={6}>
                  {/* Scorre all'indice piu' in basso, NON apre /esplora: si
                      chiamava «Apri il registro» come il pulsante della sezione
                      sotto, che invece porta all'archivio. Due etichette
                      identiche verso due destinazioni diverse nella stessa
                      pagina. */}
                  <a
                    href="#indice-vivo"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[var(--color-accent-hover)] cursor-pointer"
                  >
                    Guarda l&apos;indice <ArrowDown size={16} />
                  </a>
                </MagneticWrapper>

                <MagneticWrapper strength={4}>
                  <Link
                    to="/mappa"
                    className="inline-flex items-center gap-2 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] hover:text-[var(--color-accent-text)]"
                  >
                    Vai alla mappa <Map size={16} />
                  </Link>
                </MagneticWrapper>
              </motion.div>

              {/* Proof Signals */}
              {/* Erano tre aggettivi — «Esperienze reali · Costi trasparenti ·
                  Periodo consigliato» — e il terzo prometteva un dato che il
                  modello non ha: nessun posto porta un periodo. Ora sono due
                  numeri contati sul registro e una riga che spiega perché il
                  prezzo a volte manca. I numeri non possono invecchiare male:
                  li conta il codice, non la copy.
                  Le prove vanno a capo come unità intere: senza `flex-wrap` si
                  incolonnavano strette e spezzavano le etichette a metà. */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-5 text-xs font-semibold text-[var(--color-muted-fg)] sm:gap-x-6"
              >
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                  {POSTI_PROVATI.length} posti provati di persona
                </span>
                <span aria-hidden>·</span>
                <span className="whitespace-nowrap">
                  {CON_COLLABORAZIONE} collaborazioni dichiarate
                </span>
                <span aria-hidden>·</span>
                <span className="whitespace-nowrap">Costi in chiaro dove li abbiamo pagati</span>
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
                    src={featured?.cover}
                    alt={featured?.coverAlt ?? ''}
                    priority
                    responsiveWidths={[320, 480, 768]}
                    baseWidth={1080}
                    // Deve restare IDENTICO a `imagesizes` del preload in
                    // index.html. Sotto sm la foto è larga quanto il contenuto
                    // meno i padding (24+12 per lato); fra sm e lg il tetto
                    // `max-w-sm` la fissa a 360px; da lg vale la colonna.
                    sizes="(max-width: 639px) calc(100vw - 72px), (max-width: 1023px) 360px, 37vw"
                    // La sorgente è il frame del reel, 9:16, con la title-card
                    // in alto. In un riquadro 4:5 il centro esatto la taglia a
                    // metà: `coverFocusY` del posto è l'ancora che la esclude e
                    // lascia la fotografia. Il nome del posto è scritto sotto,
                    // in Fraunces, come didascalia.
                    style={{ objectPosition: `50% ${featured?.coverFocusY ?? 50}%` }}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-serif italic text-[var(--color-muted-fg)]">
                  {featuredCaption}
                </p>
                {/* Oggi il posto in copertina è organico e questa riga non
                    compare. Resta perché la prossima copertina potrebbe non
                    esserlo, e una collaborazione non può stare dietro un
                    pannello da aprire mentre la foto fa da prova. */}
                {featuredDisclosure && (
                  <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
                    {featuredDisclosure}
                    {featured?.partnership.partner ? ` · ${featured.partnership.partner}` : ''}
                  </p>
                )}
              </div>
            </TiltCard>

            {/* Il post-it sulla foto. Portava un aforisma — «La strada giusta
                non è quella più breve» — cioè l'unico elemento decorativo puro
                di un'apertura che per il resto prova quello che dice. Ora porta
                i due dati che il lettore cerca guardando quella foto: quanto
                costa e quando ci siamo stati. Se il posto non li ha, il
                foglietto non compare: meglio niente che una frase di riempimento. */}
            {featuredNota && (
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, y: 15 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: 'easeOut' }}
                className="absolute bottom-12 -left-6 max-w-xs rotate-[-3deg] rounded-2xl border border-[var(--color-border)] bg-[var(--color-sand,#faf7f2)] p-4 shadow-lg"
              >
                <p className="font-serif text-base leading-snug text-[var(--color-ink)]">
                  {featuredNota}
                </p>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                  — Rodrigo &amp; Betta
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
