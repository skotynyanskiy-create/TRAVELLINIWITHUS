import { useState } from 'react';
import { Play } from 'lucide-react';
import OptimizedImage from '@/src/components/OptimizedImage';
import { getReelForPosto } from '@/src/config/reels';
import { meseAnno } from '@/src/utils/format';

/**
 * Il reel girato in questo posto, dentro la scheda.
 *
 * Prima il video esisteva ma da qui non si vedeva: la scheda offriva solo un
 * link in uscita verso Instagram, quindi chi arrivava dalla mappa o da una
 * ricerca non vedeva mai il posto in movimento — la cosa piu' convincente che
 * il progetto ha.
 *
 * Tre regole:
 *
 * - **Copertina prima, video su tap.** I reel pesano 9,5 MB di media: qui
 *   sarebbero scaricati da chiunque apra la scheda, anche da chi e' venuto solo
 *   per l'indirizzo.
 * - **Il 9:16 non si forza.** Un solo lato comanda: la larghezza del riquadro,
 *   che resta stretto perche' la scheda e' una pagina di lettura, non un feed.
 * - **Nessun testo del reel.** Verificato su tutte e 29 le schede: `hook` e
 *   `caption` del reel sono *identici* al titolo e alla descrizione della
 *   scheda, perche' l'import li ha presi dalla stessa didascalia Instagram.
 *   Ristamparli qui vorrebbe dire far leggere la stessa riga due volte. L'unica
 *   cosa che il reel aggiunge e' **quando** e' stato girato.
 */

export default function ReelDelPosto({ postoId, luogo }: { postoId: string; luogo?: string }) {
  const reel = getReelForPosto(postoId);
  const [inRiproduzione, setInRiproduzione] = useState(false);

  if (!reel) return null;

  const girato = meseAnno(reel.publishedAt);

  return (
    <section aria-labelledby="reel-del-posto" className="mt-10">
      <h2
        id="reel-del-posto"
        className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]"
      >
        Il posto in movimento
      </h2>

      {/* La riga sotto, non di fianco: e' una riga sola, e accanto a un 9:16
          alto 430px lasciava mezza colonna di vuoto. */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="relative aspect-[9/16] w-full max-w-[15rem] shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black shadow-[var(--shadow-md)]">
          {inRiproduzione ? (
            <video
              src={reel.localPath}
              poster={reel.cover}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="h-full w-full object-cover"
            >
              <track kind="captions" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setInRiproduzione(true)}
              aria-label={`Riproduci il reel: ${reel.hook}`}
              className="group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <OptimizedImage
                src={reel.cover}
                alt={reel.alt}
                sizes="240px"
                responsiveWidths={[320, 480]}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-xl transition-transform group-hover:scale-110">
                  <Play size={22} className="ml-1 fill-current" aria-hidden />
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="min-w-0">
          {/* Senza preposizione: «a Verona» ma «ad Ancona» e «in Egitto» — la
              regola giusta dipende dalla parola, e sbagliarla si vede. */}
          <p className="max-w-[52ch] text-sm text-[var(--color-ink-2)]">
            {[luogo, girato].filter(Boolean).join(', ')}
            {luogo || girato ? '. ' : ''}
            Il video è quello pubblicato su Instagram, non un montaggio per il sito.
          </p>
        </div>
      </div>
    </section>
  );
}
