import { motion } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';
import { Lock, ArrowRight } from 'lucide-react';

/**
 * Preview di una guida del Club bloccata a 200 parole, poi lock visivo.
 *
 * Pattern Marathon FASE 1.C 2026-05-17 (SEO/Conv strategist):
 * "demo del valore (preview di 1 guida premium con lock dopo 200 parole)".
 *
 * Mostra a un visitatore non-membro com'e' fatta una guida vera, senza
 * promesse marketing astratte. Il taglio a 200 parole + gradient fade rende
 * la value comm tangibile.
 *
 * Estratto e' rappresentativo del tono Travellini: dato concreto, dettaglio
 * sensoriale, voce diretta. Non e' lorem ipsum.
 */
export default function ClubPreviewLock() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-12 max-w-2xl">
          <span className="text-eyebrow">Vedete com&apos;è fatta una guida</span>
          <h2 className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
            Le guide del Club sono lunghe, lente, dettagliate.
          </h2>
          <p className="mt-6 text-body-editorial">
            Qui sotto trovate un estratto rappresentativo del formato Club: voce diretta, dettagli
            pratici, prezzi e note che aiutano a decidere. Il catalogo completo apre dopo la
            waitlist.
          </p>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-black/8 bg-white p-9 shadow-[var(--shadow-md)] md:p-14"
        >
          <header className="mb-8">
            <span className="text-eyebrow">Salento · Agosto 2025</span>
            <h3 className="mt-4 font-serif font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,3rem)]">
              Tre giorni a Marina Serra,
              <br className="hidden sm:block" />
              <span className="italic text-black/65">
                tra alberghi morti e calette ancora vive.
              </span>
            </h3>
            <p className="mt-5 text-eyebrow text-[var(--color-ink)]">
              di Rodrigo & Betta · 12 minuti di lettura · aggiornata 2025-09-12
            </p>
          </header>

          {/* Preview body con drop cap editoriale */}
          <div className="article-body relative">
            <p className="text-body-editorial">
              Marina Serra non è quella delle foto. Quella delle foto è una piscina naturale di
              sette metri di diametro scavata dal mare in una roccia di tufo, dove alle undici del
              mattino di un sabato d&apos;agosto c&apos;è già gente a turno per il tuffo perfetto.
              Quella che vi diciamo noi è il resto: i novanta metri di costa a sinistra, dove
              l&apos;acqua è uguale ma non c&apos;è il rituale del tuffo, e quindi nemmeno la fila.
            </p>
            <p className="text-body-editorial mt-6">
              Ci siamo arrivati la prima volta tre estati fa, su consiglio del marito della padrona
              della trattoria di Tricase Porto. Non l&apos;abbiamo trovato online. L&apos;ha
              disegnato lui su un tovagliolo, dopo le otto di sera quando il locale si era svuotato
              e si poteva parlare. Da allora ci torniamo ogni agosto: stessi tre giorni, stesso
              parcheggio, stesso panino al tonno del bar dietro al parcheggio (3,50 € nel 2025, era
              3,00 € nel 2023).
            </p>
            <p className="text-body-editorial mt-6">
              Quello che faremo qui non è raccontarvi Marina Serra come la conosce tutto il sud
              Salento ad agosto — fila, lido, foto, ripartenza. Vi diciamo cosa abbiamo capito noi
              in tre estati: dove parcheggiare per arrivare in
            </p>

            {/* Lock gradient + CTA */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white to-transparent" />
          </div>

          <div className="mt-12 flex flex-col items-start gap-6 border-t border-black/8 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Lock size={20} className="mt-0.5 shrink-0 text-[var(--color-ink)]" />
              <p className="text-body-editorial max-w-md">
                Altri 9 minuti di lettura, 14 punti GPS, mappa con orari del sole, e i due
                ristoranti dove abbiamo prenotato di nuovo.
              </p>
            </div>
            <Link
              to="#club-pricing"
              onClick={(e) => {
                // Smooth scroll alle tier pricing nell'hero sopra.
                e.preventDefault();
                document.getElementById('club-pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-4 text-eyebrow text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Mettimi in lista <ArrowRight size={14} />
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
