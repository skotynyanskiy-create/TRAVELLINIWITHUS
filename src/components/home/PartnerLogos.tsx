import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../../services/analytics';

export interface Partner {
  name: string;
  /** URL partner pubblico oppure hash interno (#contatti) */
  href?: string;
  /** Optional logo mark. Se assente mostriamo il wordmark testuale. */
  logo?: string;
}

const DEMO_PARTNERS: Partner[] = [
  { name: 'Visit Sardegna' },
  { name: 'Pugliapromozione' },
  { name: 'ENIT — Agenzia Nazionale Turismo' },
  { name: 'Visit Grecia' },
  { name: 'Hotel Villa Dei Sogni' },
  { name: 'Heymondo' },
  { name: 'Airalo' },
  { name: 'GetYourGuide' },
];

interface PartnerLogosProps {
  partners?: Partner[];
}

export default function PartnerLogos({ partners }: PartnerLogosProps) {
  const items = partners && partners.length > 0 ? partners : DEMO_PARTNERS;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-328 px-6 md:px-10 xl:px-12">
        <motion.div
          className="mb-10 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Collaborazioni
            </span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Brand ed enti che hanno scelto di raccontarsi con noi
            </h2>
          </div>
          <Link
            to="/collaborazioni"
            className="inline-flex items-center gap-2 self-center rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text md:self-auto"
          >
            Lavora con noi
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.ul
          role="list"
          aria-label="Partner e brand con cui abbiamo lavorato"
          className="grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {items.map((partner) => {
            const content = partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                className="h-10 w-auto object-contain opacity-60 transition-all duration-300 group-hover:opacity-100 md:h-12"
              />
            ) : (
              <span className="font-serif text-lg leading-tight text-black/45 transition-colors duration-300 group-hover:text-ink md:text-xl">
                {partner.name}
              </span>
            );

            const className = 'group flex h-16 items-center justify-center text-center md:h-20';

            if (partner.href) {
              return (
                <li key={partner.name} className="contents">
                  <a
                    href={partner.href}
                    target={partner.href.startsWith('http') ? '_blank' : undefined}
                    rel={partner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => trackEvent('partner_logo_click', { partner: partner.name })}
                    className={className}
                    aria-label={partner.name}
                  >
                    {content}
                  </a>
                </li>
              );
            }

            return (
              <li key={partner.name} className={className}>
                {content}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
