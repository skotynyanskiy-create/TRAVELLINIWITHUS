import { ArrowRight, Map, Palette, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

type ProductType = 'maps' | 'presets' | 'ebook';

interface ShopContextualCtaProps {
  destinationName: string;
  productType: ProductType;
  productUrl: string;
  /** Optional count of locations/presets */
  count?: number;
}

const PRODUCT_CONFIG: Record<
  ProductType,
  {
    icon: React.ElementType;
    getTitle: (dest: string, count?: number) => string;
    subtitle: string;
    cta: string;
  }
> = {
  maps: {
    icon: Map,
    getTitle: (dest, count) =>
      count
        ? `Le nostre ${count} location a ${dest} nella tua Google Maps`
        : `I posti migliori di ${dest} nella tua Google Maps`,
    subtitle: 'Salva i punti che abbiamo selezionato e trovalo tutto quando sei sul posto.',
    cta: 'Vedi la mappa',
  },
  presets: {
    icon: Palette,
    getTitle: () => 'I preset che usiamo per le nostre foto di viaggio',
    subtitle: 'Lightroom Mobile & Desktop. Lo stesso look delle nostre foto, pronto da applicare.',
    cta: 'Scopri i preset',
  },
  ebook: {
    icon: BookOpen,
    getTitle: (dest) => `La guida completa di ${dest} in formato digitale`,
    subtitle:
      'Tutto quello che ti serve per pianificare, in un unico file da salvare e portare con te.',
    cta: 'Vedi la guida',
  },
};

export default function ShopContextualCta({
  destinationName,
  productType,
  productUrl,
  count,
}: ShopContextualCtaProps) {
  const config = PRODUCT_CONFIG[productType];
  const Icon = config.icon;

  return (
    <div className="my-12 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] p-8 text-white shadow-lg md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-accent)]">
          <Icon size={24} />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-serif leading-snug md:text-2xl">
            {config.getTitle(destinationName, count)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{config.subtitle}</p>
        </div>

        <Link
          to={productUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-[0.98]"
        >
          {config.cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
