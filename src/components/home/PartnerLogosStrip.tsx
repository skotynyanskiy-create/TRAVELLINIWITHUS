/**
 * Striscia partner — marquee infinito orizzontale.
 *
 * Demo: 10 brand fittizi con tipo (hotel boutique, DMO, lifestyle, tour operator).
 * Pattern (ref: Stripe "Trusted by", Linear "loved by teams"): marquee
 * lento + hover pause + opacity reveal a colori del brand.
 *
 * TODO R+B: sostituire PARTNERS con 5+ partner reali quando shortlist
 * Q3 2026 produce primi closure. Mantenere variant "type" per chiarezza
 * (no logo unifor in absence di brand asset).
 */

// Flip a `true` quando esistono almeno 5 partner reali con autorizzazione
// scritta a comparire nella strip. Finche' e' false, il blocco non viene
// renderizzato e nessun "(demo)" e' visibile in produzione.
const HAS_REAL_PARTNERS = false;

interface PartnerPlaceholder {
  name: string;
  type: string;
}

const PARTNERS: PartnerPlaceholder[] = [
  { name: 'Casa Brugia', type: 'Boutique hotel' },
  { name: 'Visit Andalusia', type: 'DMO' },
  { name: 'Atelier Norte', type: 'Lifestyle' },
  { name: 'Strada Trieste', type: 'Tour operator' },
  { name: 'Lido di Bosa', type: 'Hospitality' },
  { name: 'Domus Capri', type: 'Boutique stay' },
  { name: 'Borghi Italia', type: 'Network' },
  { name: 'Wineyard Stays', type: 'Boutique' },
  { name: 'Slow Tour Co.', type: 'Experience' },
  { name: 'Costa Marche', type: 'DMO' },
];

export default function PartnerLogosStrip() {
  if (!HAS_REAL_PARTNERS) return null;

  // Duplichiamo la lista per loop seamless (la chiave del marquee infinito:
  // animare translateX al -50%, dove il primo set diventa esattamente la
  // posizione iniziale del secondo).
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <div className="border-y border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
          Tra i progetti che raccontiamo (demo)
        </p>
        <div
          className="group relative overflow-hidden"
          // Fade soft ai bordi per nascondere il "taglio" del marquee
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
          }}
        >
          <ul
            className="flex w-max gap-10 [animation:twu-marquee_42s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none] md:gap-14"
            aria-label="Partner placeholder"
          >
            {items.map((partner, idx) => (
              <li
                key={`${partner.name}-${idx}`}
                className="flex shrink-0 flex-col items-center justify-center text-center"
              >
                <span className="font-serif text-lg leading-tight text-white/70 transition-colors group-hover:text-white/85 hover:text-white">
                  {partner.name}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/40">
                  {partner.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keyframes locali (Tailwind v4 + arbitrary animation values) */}
      <style>{`
        @keyframes twu-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
