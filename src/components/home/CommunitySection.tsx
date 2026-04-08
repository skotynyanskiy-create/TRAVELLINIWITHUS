import { motion } from 'motion/react';
import { ArrowRight, DollarSign, Heart, Instagram, Map, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACTS, BRAND_STATS } from '../../config/site';
import type { LucideIcon } from 'lucide-react';

export default function CommunitySection() {
  return (
    <section className="bg-[var(--color-sand)] py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="rounded-[2.5rem] bg-[var(--color-ink)] p-10 text-white md:p-16 relative overflow-hidden bg-topo">
          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="mb-3 block font-script text-xl text-[var(--color-gold)]">I nostri canali</span>
              <h2 className="text-3xl font-serif leading-tight md:text-4xl">
                Seguici dove preferisci.
              </h2>
              <p className="mt-5 text-base font-normal leading-relaxed text-white/85">
                {BRAND_STATS.instagramFollowers} su Instagram, {BRAND_STATS.tiktokFollowers} su TikTok — ogni giorno posti veri, consigli pratici e idee per il prossimo viaggio.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
                  className="inline-flex items-center gap-2 rounded-full bg-black border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
                  </svg>
                  TikTok
                </a>
                <a
                  href={CONTACTS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-social-facebook)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>

              <Link
                to="/club"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(196,164,124,0.25)]"
              >
                Unisciti ai Travellini
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {([
                { icon: Map, title: 'Itinerari reali', text: 'Solo posti visitati di persona. Niente copy-paste.' },
                { icon: DollarSign, title: 'Budget travel', text: 'Viaggiare bene spendendo meno.' },
                { icon: UtensilsCrossed, title: 'Food experience', text: 'Mangiamo dove mangiano i locali.' },
                { icon: Heart, title: 'Travel in coppia', text: 'Consigli per chi viaggia col partner.' },
              ] as { icon: LucideIcon; title: string; text: string }[]).map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="card-dark border-t border-t-[var(--color-gold)]/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-gold)]/10">
                    <item.icon size={20} className="text-[var(--color-gold)]" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs font-normal leading-relaxed text-white/75">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
