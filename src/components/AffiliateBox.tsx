import React from 'react';
import { ExternalLink, Shield, Plane, Hotel, MapPin, Tag } from 'lucide-react';
import { trackEvent } from '../services/analytics';
import OptimizedImage from './OptimizedImage';

export type AffiliateProvider = 'booking' | 'heymondo' | 'skyscanner' | 'getyourguide' | 'amazon' | 'generic';

interface AffiliateBoxProps {
  provider: AffiliateProvider;
  title: string;
  description: string;
  link: string;
  ctaText?: string;
  image?: string;
  badgeText?: string;
  campaignId?: string; // For tracking specific campaigns
}

const providerConfig = {
  booking: {
    icon: <Hotel className="text-[var(--color-affiliate-booking)]" size={24} />,
    color: 'var(--color-affiliate-booking)',
    bgLight: 'bg-[var(--color-affiliate-booking-soft)]',
    defaultCta: 'Vedi su Booking.com',
    logo: 'Booking.com'
  },
  heymondo: {
    icon: <Shield className="text-[var(--color-affiliate-heymondo)]" size={24} />,
    color: 'var(--color-affiliate-heymondo)',
    bgLight: 'bg-[var(--color-accent-soft)]',
    defaultCta: 'Calcola Preventivo (-10%)',
    logo: 'Heymondo'
  },
  skyscanner: {
    icon: <Plane className="text-[var(--color-affiliate-skyscanner)]" size={24} />,
    color: 'var(--color-affiliate-skyscanner)',
    bgLight: 'bg-[var(--color-affiliate-skyscanner-soft)]',
    defaultCta: 'Cerca Voli',
    logo: 'Skyscanner'
  },
  getyourguide: {
    icon: <MapPin className="text-[var(--color-affiliate-getyourguide)]" size={24} />,
    color: 'var(--color-affiliate-getyourguide)',
    bgLight: 'bg-[var(--color-affiliate-getyourguide-soft)]',
    defaultCta: 'Prenota Attività',
    logo: 'GetYourGuide'
  },
  amazon: {
    icon: <Tag className="text-[var(--color-affiliate-amazon)]" size={24} />,
    color: 'var(--color-affiliate-amazon)',
    bgLight: 'bg-[var(--color-affiliate-amazon-soft)]',
    defaultCta: 'Acquista su Amazon',
    logo: 'Amazon'
  },
  generic: {
    icon: <ExternalLink className="text-[var(--color-accent)]" size={24} />,
    color: 'var(--color-accent)',
    bgLight: 'bg-[var(--color-sand)]',
    defaultCta: 'Scopri di più',
    logo: 'Partner'
  }
};

export default function AffiliateBox({ 
  provider, 
  title, 
  description, 
  link, 
  ctaText, 
  image, 
  badgeText,
  campaignId = 'default'
}: AffiliateBoxProps) {
  const config = providerConfig[provider] || providerConfig.generic;

  const handleClick = () => {
    trackEvent('affiliate_click', {
      provider,
      campaign_id: campaignId,
      link_url: link,
      title: title
    });
  };

  return (
    <div className="my-10 bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-all duration-300">
      {image && (
        <div className="sm:w-2/5 md:w-1/3 h-48 sm:h-auto overflow-hidden relative">
          <OptimizedImage 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          {badgeText && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-black shadow-sm">
              {badgeText}
            </div>
          )}
        </div>
      )}
      
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${config.bgLight} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <span className="uppercase tracking-widest text-[10px] font-bold text-black/40 block">Consigliato da noi</span>
            <span className="text-xs font-medium" style={{ color: config.color }}>{config.logo}</span>
          </div>
        </div>
        
        <h4 className="text-2xl font-serif mb-3 text-zinc-900 group-hover:text-[var(--color-accent)] transition-colors">
          {title}
        </h4>
        
        <p className="text-black/60 font-light text-sm leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="mt-auto">
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: config.color }}
          >
            {ctaText || config.defaultCta}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
