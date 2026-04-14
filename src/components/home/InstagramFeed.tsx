import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { CONTACTS } from '../../config/site';

/* TODO: sostituire tutte le immagini con foto reali dal profilo Instagram */
// TODO(@travelliniwithus): PLACEHOLDER — servono foto reali dal profilo Instagram @travelliniwithus
const FEED_IMAGES = [
  { src: '/images/destinations/dolomiti.png', alt: 'Coffee and travel', offsetClass: '' },
  { src: '/images/destinations/puglia.png', alt: 'Paris', offsetClass: 'md:translate-y-8' },
  {
    src: '/images/destinations/sardegna.png',
    alt: 'Mountain lake',
    offsetClass: 'hidden lg:block -translate-y-4',
  },
  {
    src: '/images/destinations/toscana.png',
    alt: 'Rainy street',
    offsetClass: 'md:translate-y-12',
  },
  { src: '/images/destinations/islanda.png', alt: 'Beach', offsetClass: '' },
];

export default function InstagramFeed() {
  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 text-center mb-12">
        <div className="ornament-gold mb-8">
          <div className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)]" />
        </div>
        <div className="mb-3 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.4em] leading-none text-[var(--color-gold)]">
          <Instagram size={14} />
          @travelliniwithus
        </div>
        <h2 className="text-3xl font-serif leading-tight text-ink md:text-4xl">
          Il diario visivo del viaggio.
        </h2>
        <p className="mt-3 text-base font-normal text-black/70">
          Ogni giorno posti veri, momenti autentici e scorci da non dimenticare.
        </p>
      </div>

      <div className="mx-auto max-w-[1600px] px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {FEED_IMAGES.map((img, idx) => (
            <motion.a
              key={idx}
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block relative aspect-4/5 rounded-2xl overflow-hidden group transition-all duration-300 hover:ring-2 hover:ring-[var(--color-gold)]/30 hover:ring-offset-2 ${img.offsetClass}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
            >
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="text-white" size={28} />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[var(--color-ink)]/85 hover:-translate-y-0.5"
          >
            <Instagram size={16} />
            Seguici su Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
