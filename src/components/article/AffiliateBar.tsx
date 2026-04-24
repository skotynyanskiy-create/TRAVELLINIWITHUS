import { ExternalLink, Hotel, Plane, Shield, MapPin, Wifi, Car } from 'lucide-react';
import { prepareAffiliateLink, type AffiliatePartner } from '../../lib/affiliate';

interface AffiliateBarLink {
  partner: AffiliatePartner;
  label: string;
  cta: string;
  icon: React.ElementType;
  tone: 'booking' | 'skyscanner' | 'heymondo' | 'getyourguide' | 'accent' | 'ink';
  url: string;
}

const DEFAULT_AFFILIATE_LINKS: AffiliateBarLink[] = [
  {
    partner: 'booking',
    label: 'Hotel',
    cta: 'Cerca su Booking',
    icon: Hotel,
    tone: 'booking',
    url: 'https://www.booking.com',
  },
  {
    partner: 'skyscanner',
    label: 'Voli',
    cta: 'Cerca su Skyscanner',
    icon: Plane,
    tone: 'skyscanner',
    url: 'https://www.skyscanner.it',
  },
  {
    partner: 'heymondo',
    label: 'Assicurazione',
    cta: 'Preventivo -10%',
    icon: Shield,
    tone: 'heymondo',
    url: 'https://www.heymondo.it',
  },
  {
    partner: 'getyourguide',
    label: 'Esperienze',
    cta: 'Prenota attività',
    icon: MapPin,
    tone: 'getyourguide',
    url: 'https://www.getyourguide.it',
  },
  {
    partner: 'airalo',
    label: 'eSIM',
    cta: 'Attiva eSIM',
    icon: Wifi,
    tone: 'accent',
    url: 'https://www.airalo.com',
  },
  {
    partner: 'generic',
    label: 'Noleggio Auto',
    cta: 'Confronta prezzi',
    icon: Car,
    tone: 'ink',
    url: 'https://www.rentalcars.com',
  },
];

interface AffiliateBarProps {
  /** Destination name for tracking context */
  destination?: string;
  /** Custom links override the defaults */
  links?: AffiliateBarLink[];
}

export default function AffiliateBar({ destination = 'generico', links }: AffiliateBarProps) {
  const affiliateLinks = links ?? DEFAULT_AFFILIATE_LINKS;
  const toneClasses: Record<AffiliateBarLink['tone'], { wrap: string; icon: string }> = {
    booking: {
      wrap: 'bg-[var(--color-affiliate-booking-soft)]',
      icon: 'text-[var(--color-affiliate-booking)]',
    },
    skyscanner: {
      wrap: 'bg-[var(--color-affiliate-skyscanner-soft)]',
      icon: 'text-[var(--color-affiliate-skyscanner)]',
    },
    heymondo: {
      wrap: 'bg-[var(--color-accent-soft)]',
      icon: 'text-[var(--color-affiliate-heymondo)]',
    },
    getyourguide: {
      wrap: 'bg-[var(--color-affiliate-getyourguide-soft)]',
      icon: 'text-[var(--color-affiliate-getyourguide)]',
    },
    accent: {
      wrap: 'bg-[var(--color-accent-soft)]',
      icon: 'text-[var(--color-accent)]',
    },
    ink: {
      wrap: 'bg-[var(--color-sand)]',
      icon: 'text-[var(--color-ink)]',
    },
  };

  return (
    <section className="scroll-mt-32">
      <div className="rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-6 md:p-8">
        <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Prenota con i nostri link
            </p>
            <p className="mt-1 text-sm text-black/55">
              Servizi che usiamo davvero. Se prenoti da qui ci aiuti a mantenere il progetto, senza
              costi extra per te.
            </p>
          </div>
          <span className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 md:mt-0">
            <ExternalLink size={10} />
            Link affiliati
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {affiliateLinks.map((link) => {
            const { href, onClick } = prepareAffiliateLink(link.partner, link.url, {
              campaign: `article_${destination}`,
              placement: 'affiliate_bar',
              label: link.label,
            });
            const tone = toneClasses[link.tone];

            return (
              <a
                key={link.label}
                href={href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={onClick}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-black/5 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${tone.wrap}`}
                >
                  <link.icon size={18} className={tone.icon} />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[var(--color-ink)]">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-black/40 transition-colors group-hover:text-[var(--color-accent)]">
                    {link.cta}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
