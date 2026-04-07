import { ExternalLink, Shield, Plane, Hotel, Smartphone } from 'lucide-react';
import Button from './Button';
import { trackEvent } from '../services/analytics';

interface AffiliateWidgetProps {
  type: 'insurance' | 'booking' | 'esim' | 'gear';
  title?: string;
  description?: string;
  link?: string;
  cta?: string;
  discount?: string;
  image?: string;
}

export default function AffiliateWidget({ type, title, description, link, cta, discount, image }: AffiliateWidgetProps) {
  const configs = {
    insurance: {
      icon: <Shield className="text-[var(--color-accent)]" size={24} />,
      defaultTitle: 'Assicurazione Viaggio',
      defaultDescription: 'Non partire mai senza protezione. Abbiamo scelto Heymondo per la sua affidabilità e copertura completa.',
      defaultLink: 'https://heymondo.it',
      defaultCta: 'Ottieni Sconto 10%',
      defaultDiscount: '10% Sconto Esclusivo'
    },
    booking: {
      icon: <Hotel className="text-[var(--color-accent)]" size={24} />,
      defaultTitle: 'Dove Dormire?',
      defaultDescription: 'Confronta prezzi, leggi le recensioni e prenota alloggi per ogni budget su Booking.com.',
      defaultLink: 'https://booking.com',
      defaultCta: 'Vedi Offerte',
      defaultDiscount: 'Miglior Prezzo Garantito'
    },
    esim: {
      icon: <Smartphone className="text-[var(--color-accent)]" size={24} />,
      defaultTitle: 'Resta Connesso',
      defaultDescription: 'Evita il roaming costoso. Usa una eSIM Airalo per avere internet immediato ovunque nel mondo.',
      defaultLink: 'https://airalo.com',
      defaultCta: 'Usa Codice: TRAVELLINI3',
      defaultDiscount: '$3 di Credito Gratis'
    },
    gear: {
      icon: <Plane className="text-[var(--color-accent)]" size={24} />,
      defaultTitle: 'La Nostra Attrezzatura',
      defaultDescription: 'Scopri i prodotti che utilizziamo per i nostri viaggi e per creare i nostri contenuti.',
      defaultLink: '/risorse',
      defaultCta: 'Scopri il Toolkit',
      defaultDiscount: 'Scelte da Esperti'
    }
  };

  const config = configs[type];

  const handleClick = () => {
    trackEvent('affiliate_click', {
      type,
      title: title || config.defaultTitle,
      link_url: link || config.defaultLink
    });
  };

  return (
    <div className="my-12 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {image && (
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden bg-gray-50 flex items-center justify-center p-4">
          <img 
            src={image} 
            alt={title || config.defaultTitle} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110" 
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-8 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          {config.icon}
          <span className="uppercase tracking-widest text-[10px] font-bold text-[var(--color-accent)]">Consiglio Travellini</span>
        </div>
        <h4 className="text-2xl font-serif mb-3">{title || config.defaultTitle}</h4>
        <p className="text-black/60 font-light text-sm leading-relaxed mb-6">
          {description || config.defaultDescription}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <Button 
            href={link || config.defaultLink} 
            variant="primary" 
            size="sm"
            className="group"
            onClick={handleClick}
          >
            <span className="flex items-center gap-2">
              {cta || config.defaultCta}
              <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          <LinkIconLink href="/risorse" label="Vedi tutte le risorse" />
        </div>
      </div>
      <div className="bg-[var(--color-sand)] p-8 flex flex-col justify-center items-center text-center sm:w-48 border-t md:border-t-0 md:border-l border-black/5">
        <div className="text-[var(--color-accent)] font-serif text-xl mb-1">{discount || config.defaultDiscount}</div>
        <div className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">Risparmio Garantito</div>
      </div>
    </div>
  );
}

function LinkIconLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-[var(--color-accent)] transition-colors">
      {label}
    </a>
  );
}
