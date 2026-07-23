import { Sparkles, ArrowRight } from 'lucide-react';
import HolographicTicketCard from './HolographicTicketCard';
import { Link } from '@/src/components/TransitionLink';

const TICKETS_DATA = [
  {
    id: 'ticket-1',
    title: 'La Taverna dei Draghi & Notti nel Borgo',
    location: 'Volterra, Toscana',
    type: 'Cena Particolare',
    score: '10/10',
    price: '€ 45 / persona',
    cover: '/images/reels/reel-3-cover.webp',
    videoSrc: '/video esempio/taverna.mp4',
    caption:
      'Cena a lume di candela in sotterranei in pietra del 1300. Risveglio nel borgo medievale.',
  },
  {
    id: 'ticket-2',
    title: 'Masseria di Luce tra gli Ulivi',
    location: "Val d'Itria, Puglia",
    type: 'Dimora Storica',
    score: '9.8/10',
    price: '€ 180 / notte',
    cover: '/images/reels/reel-2-cover.webp',
    videoSrc: '/video esempio/taverna.mp4',
    caption: 'Piscina privata nella roccia bianca e colazione sotto gli ulivi secolari.',
  },
  {
    id: 'ticket-3',
    title: 'Rorbu sui Fiordi & Aurora Boreale',
    location: 'Lofoten, Norvegia',
    type: 'Esperienza Unica',
    score: '10/10',
    price: '€ 210 / notte',
    cover: '/images/reels/reel-4-cover.webp',
    videoSrc: '/video esempio/taverna.mp4',
    caption: "Casa di pescatori sull'acqua gelida con cielo aperto e vista aurora dal letto.",
  },
];

export default function ImmersiveTicketShowcase() {
  return (
    <section className="bg-[var(--color-ink,#1a2b3c)] py-20 md:py-28 text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-14 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              <Sparkles size={14} />
              Card 3D Olografiche · Passaporto
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              I Biglietti di Viaggio Verificati.
            </h2>
          </div>
          <Link
            to="/esplora"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-sand)] hover:text-[var(--color-accent)] md:mt-0"
          >
            Vedi tutti i posti provati
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3D Holographic Card Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {TICKETS_DATA.map((ticket) => (
            <HolographicTicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      </div>
    </section>
  );
}
