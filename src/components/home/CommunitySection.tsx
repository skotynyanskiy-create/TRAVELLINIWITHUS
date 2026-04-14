import { motion } from 'motion/react';
import { ArrowRight, Instagram, Heart, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACTS, BRAND_STATS } from '../../config/site';

const INSTAGRAM_GRID = [
  { src: '/images/destinations/toscana.png', alt: 'Toscana — colline e borghi' },
  { src: '/images/experiences/gastronomia.png', alt: 'Food — sapori autentici' },
  { src: '/images/destinations/dolomiti.png', alt: 'Dolomiti — vette e natura' },
  { src: '/images/experiences/insolito.png', alt: 'Luoghi insoliti — grotte e meraviglie' },
  { src: '/images/destinations/sardegna.png', alt: 'Sardegna — mare cristallino' },
  { src: '/images/experiences/romantico.png', alt: 'Weekend romantici — tramonti' },
  { src: '/images/destinations/puglia.png', alt: 'Puglia — trulli e tradizione' },
  { src: '/images/brand/couple-travel.png', alt: 'Rodrigo e Betta in viaggio' },
];

const SOCIAL_STATS = [
  { value: BRAND_STATS.instagramFollowers, label: 'Instagram', platform: 'ig' },
  { value: BRAND_STATS.tiktokFollowers, label: 'TikTok', platform: 'tt' },
  { value: BRAND_STATS.destinationsExplored, label: 'Destinazioni', platform: 'dest' },
  { value: BRAND_STATS.postsPublished, label: 'Contenuti', platform: 'posts' },
];

export default function CommunitySection() {
  return (
    <section className="bg-[var(--color-ink)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            La community
          </span>
          <h2 className="mt-3 text-3xl font-serif text-white md:text-5xl">
            Unisciti a chi viaggia{' '}
            <span className="text-[var(--color-gold)]">con gusto.</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-base text-white/60 md:text-lg">
            Ogni giorno nuove scoperte, posti particolari e consigli pratici sui nostri canali.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {SOCIAL_STATS.map((stat) => (
            <div
              key={stat.platform}
              className="rounded-xl border border-white/8 bg-white/5 px-5 py-5 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-serif font-bold text-white md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
        >
          {INSTAGRAM_GRID.map((item, index) => (
            <motion.a
              key={item.src}
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-1 text-white">
                  <Heart size={16} fill="white" />
                </div>
                <div className="flex items-center gap-1 text-white">
                  <MessageCircle size={16} />
                </div>
                <div className="flex items-center gap-1 text-white">
                  <Send size={16} />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom — Social CTAs + B2B */}
        <div className="flex flex-col gap-8 border-t border-white/10 pt-10 md:flex-row md:items-center md:justify-between">
          {/* Social Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--color-social-instagram-start),var(--color-social-instagram-mid),var(--color-social-instagram-end))] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href={CONTACTS.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
              </svg>
              TikTok
            </a>
          </div>

          {/* B2B CTA */}
          <div className="text-center md:text-right">
            <p className="mb-3 text-sm text-white/50">
              Hai un hotel, una destinazione o un'esperienza da raccontare?
            </p>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(196,164,124,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Leggi le guide
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
