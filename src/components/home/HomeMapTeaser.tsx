import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function hasConfiguredMapboxToken() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN?.trim();

  if (!token) return false;
  if (token === '...') return false;
  if (token.toLowerCase().includes('example')) return false;
  if (token.toLowerCase().includes('your-')) return false;

  return true;
}

export default function HomeMapTeaser() {
  if (!hasConfiguredMapboxToken()) return null;

  return (
    <section className="bg-white pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12"
      >
        <Link
          to="/mappa"
          className="group grid overflow-hidden rounded-lg border border-black/8 bg-[var(--color-ink)] text-white md:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="p-7 md:p-10 lg:p-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Mappa
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-serif leading-tight md:text-5xl">
              Esplora i luoghi sulla mappa.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Scegli per zona quando vuoi capire dove si trovano davvero i luoghi salvati.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-colors group-hover:text-[var(--color-gold)]">
              Apri la mappa <ArrowRight size={14} />
            </span>
          </div>

          <div className="relative min-h-[260px] overflow-hidden border-t border-white/10 md:border-l md:border-t-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(196,164,124,0.5)_0_2px,transparent_3px),radial-gradient(circle_at_62%_44%,rgba(255,255,255,0.46)_0_1.5px,transparent_3px),radial-gradient(circle_at_74%_70%,rgba(196,164,124,0.55)_0_2px,transparent_3px),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%),repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_42px),repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_42px)]" />
            <div className="absolute inset-x-8 top-1/2 h-px bg-[var(--color-gold)]/40" />
            <div className="absolute left-[24%] top-[30%] flex items-center gap-2">
              <MapPin size={18} className="text-[var(--color-gold)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Italia
              </span>
            </div>
            <div className="absolute right-[18%] top-[44%] h-3 w-3 rounded-full border border-white/50 bg-white/20" />
            <div className="absolute bottom-[25%] right-[24%] h-4 w-4 rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)]/20" />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
