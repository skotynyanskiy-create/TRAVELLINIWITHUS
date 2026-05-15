import { motion } from 'motion/react';
import { Instagram, Play } from 'lucide-react';
import { CONTACTS } from '../config/site';
import { trackEvent } from '../services/analytics';

interface InstaItem {
  image: string;
  type: 'reel' | 'post';
  caption: string;
  url: string;
  views?: string;
  /** Span on lg+ grid (col-span × row-span). 'feature' = 2×2, 'tall' = 1×2, 'wide' = 2×1, 'square' = 1×1 */
  span: 'feature' | 'tall' | 'wide' | 'square';
}

// TODO[R+B]: sostituire le 6 cover con screenshot reali dei reel/post di
// @travelliniwithus salvati in /public/images/instagram/. Le caption sono
// editoriali, non descrivono numeri di view (non li dichiariamo finche'
// non c'e' uno screenshot dashboard creator verificabile).
const INSTA_ITEMS: InstaItem[] = [
  {
    image: '/images/brand/couple-travel.webp',
    type: 'reel',
    caption: "Catania prima dell'alba — i posti che nessuno ti racconta",
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'feature',
  },
  {
    image: '/images/brand/about-editorial.webp',
    type: 'reel',
    caption: 'Tre rifugi delle Dolomiti che ti fanno cambiare idea',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'tall',
  },
  {
    image: '/images/brand/collab-work.webp',
    type: 'reel',
    caption: 'Andalusia in 4 giorni: dove ci siamo persi davvero',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'square',
  },
  {
    image: '/images/brand/couple-travel.webp',
    type: 'post',
    caption: 'Mercato del pesce a Brucoli',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'square',
  },
  {
    image: '/images/brand/about-editorial.webp',
    type: 'post',
    caption: 'Tramonto in Triana, Siviglia',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'wide',
  },
  {
    image: '/images/brand/collab-work.webp',
    type: 'reel',
    caption: 'Tre cose che nessuno ti dice prima di andare in Sicilia',
    url: 'https://www.instagram.com/travelliniwithus/',
    span: 'tall',
  },
];

const SPAN_CLASS: Record<InstaItem['span'], string> = {
  feature: 'lg:col-span-2 lg:row-span-2',
  tall: 'lg:row-span-2',
  wide: 'lg:col-span-2',
  square: '',
};

function handleClick(item: InstaItem, position: number) {
  trackEvent('instagram_grid_click', {
    type: item.type,
    position,
  });
}

export default function InstagramGrid() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Visto su Instagram
            </span>
            <h2 className="text-3xl font-serif text-[var(--color-ink)] md:text-4xl">
              Reel e foto di Rodrigo & Betta
            </h2>
            <p className="mt-3 text-sm text-black/55 md:text-base">
              <span className="font-semibold text-black/70">{CONTACTS.instagramHandle}</span> ·
              Posti particolari, dietro le quinte e short-form video.
            </p>
          </div>
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('instagram_grid_profile_click')}
            className="hidden items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
          >
            <Instagram size={14} /> Guarda il profilo
          </a>
        </div>

        {/*
          Masonry asimmetrica (ref: Pinterest restrained, Cereal):
          - lg+: grid 4-col, auto-rows-[220px], auto-flow dense
          - span per item determinato dal type (feature/tall/wide/square)
          - mobile: grid 2-col uniform (aspect-driven), tablet 3-col
          Su mobile NON applichiamo gli span lg per evitare cells vuote.
        */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:auto-rows-[220px] lg:grid-cols-4 lg:gap-4 [grid-auto-flow:dense]">
          {INSTA_ITEMS.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleClick(item, idx)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink)] ${
                item.type === 'reel' ? 'aspect-[9/14]' : 'aspect-[3/4]'
              } lg:aspect-auto lg:h-full ${SPAN_CLASS[item.span]}`}
            >
              <img
                src={item.image}
                alt={item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

              {item.type === 'reel' && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <Play size={10} className="fill-white text-white" />
                  Reel
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-3 text-white md:p-4">
                <p className="line-clamp-3 text-xs leading-tight md:text-sm">{item.caption}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('instagram_grid_profile_click_mobile')}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Instagram size={14} /> Guarda il profilo
          </a>
        </div>
      </div>
    </section>
  );
}
