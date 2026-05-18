import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

/**
 * FAQ Club — 6 voci basate su Marathon FASE 1.C 2026-05-17 (SEO/Conv strategist).
 *
 * Pattern: domanda concreta + risposta onesta (no "scopri tutti i benefici",
 * no marketing). Inclusa la voce "quando NON vale" che e' insolita ma costruisce
 * trust.
 *
 * Emette FAQPage JSON-LD per rich result Google + AI search citation.
 */

interface FaqItem {
  q: string;
  a: string;
  /** Versione testuale per JSON-LD (no HTML, no markup). */
  aPlain: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Quando vale la pena entrare nel Club?',
    aPlain:
      "Se nei prossimi 12 mesi pianificate almeno 4 viaggi (anche brevi) e cercate guide concrete con prezzi reali, indirizzi specifici e itinerari testati. Se viaggiate due volte all'anno seguendo il programma di una guida cartacea, il Club non vi serve.",
    a: "Se nei prossimi 12 mesi pianificate almeno 4 viaggi (anche brevi) e cercate guide concrete con prezzi reali, indirizzi specifici e itinerari testati. Se viaggiate due volte all'anno seguendo il programma di una guida cartacea, il Club non vi serve.",
  },
  {
    q: 'Quando NON vale entrare nel Club?',
    aPlain:
      "Se cercate ispirazione visiva (siamo specifici, non Pinterest), se vi interessano solo grandi destinazioni internazionali (siamo Italia-first, l'estero copre il 30%), o se preferite consigli rapidi su Instagram (il Club e' formato lungo, 1500-3500 parole per guida).",
    a: "Se cercate ispirazione visiva (siamo specifici, non Pinterest), se vi interessano solo grandi destinazioni internazionali (siamo Italia-first, l'estero copre il 30%), o se preferite consigli rapidi su Instagram (il Club e' formato lungo, 1500-3500 parole per guida).",
  },
  {
    q: "Come si cancella l'iscrizione?",
    aPlain:
      'Un click dall\'area riservata "La mia area" → Sottoscrizione → Annulla. Conferma immediata via email. Niente form, niente "sicuro di voler andare via?", niente trattenuta retention. Restate fino alla fine del mese gia pagato.',
    a: 'Un click dall\'area riservata "La mia area" → Sottoscrizione → Annulla. Conferma immediata via email. Niente form, niente "sicuro di voler andare via?", niente trattenuta retention. Restate fino alla fine del mese gia pagato.',
  },
  {
    q: "Cosa NON e' incluso nel Club?",
    aPlain:
      "Prenotazioni alberghi o esperienze (forniamo i link, prenotate voi). Consulenze 1-a-1 personalizzate. Sconti diretti su prodotti di terzi (gli affiliate link che usiamo sono visibili come tali). Garanzia di rimborso viaggio in caso di problemi (lo fa l'assicurazione, non noi).",
    a: "Prenotazioni alberghi o esperienze (forniamo i link, prenotate voi). Consulenze 1-a-1 personalizzate. Sconti diretti su prodotti di terzi (gli affiliate link che usiamo sono visibili come tali). Garanzia di rimborso viaggio in caso di problemi (lo fa l'assicurazione, non noi).",
  },
  {
    q: 'Posso regalare il Club a qualcuno?',
    aPlain:
      "Si, l'iscrizione annuale e' regalabile (scriveteci a hello@travelliniwithus.it dopo l'acquisto e attiviamo il codice sull'email del destinatario). Il regalo non si rinnova automaticamente alla scadenza.",
    a: "Si, l'iscrizione annuale e' regalabile (scriveteci a hello@travelliniwithus.it dopo l'acquisto e attiviamo il codice sull'email del destinatario). Il regalo non si rinnova automaticamente alla scadenza.",
  },
  {
    q: "Cosa succede se annullo? Perdo l'archivio?",
    aPlain:
      "Perdete l'accesso alle guide e all'archivio Club. Mantenete le guide singole eventualmente acquistate dallo shop (sono vostre per sempre). Mantenete l'account e i preferiti, accessibili anche da non-membro.",
    a: "Perdete l'accesso alle guide e all'archivio Club. Mantenete le guide singole eventualmente acquistate dallo shop (sono vostre per sempre). Mantenete l'account e i preferiti, accessibili anche da non-membro.",
  },
];

export default function ClubFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.aPlain,
      },
    })),
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="mb-14">
          <span className="text-eyebrow">Domande oneste</span>
          <h2 className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
            Sei domande
            <br />
            <span className="italic text-black/55">che ci fareste comunque.</span>
          </h2>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors"
                >
                  <span className="font-serif text-xl leading-snug text-[var(--color-ink)] md:text-2xl">
                    {item.q}
                  </span>
                  <span className="mt-1 shrink-0 text-[var(--color-ink)]">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-body-editorial pb-7 pr-10">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </div>
    </section>
  );
}
