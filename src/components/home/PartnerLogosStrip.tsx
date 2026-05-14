/**
 * Striscia partner placeholder per HomeCollaborationCta.
 *
 * Demo: 6 brand fittizi con tipo (hotel boutique, DMO, lifestyle, tour operator).
 * Sostituire con loghi reali appena partner firmano.
 */

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
];

export default function PartnerLogosStrip() {
  return (
    <div className="border-y border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-12 md:py-8">
        <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
          Tra i progetti che raccontiamo
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-6">
          {PARTNERS.map((partner) => (
            <li
              key={partner.name}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="font-serif text-lg leading-tight text-white/80 transition-colors hover:text-white">
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
  );
}
