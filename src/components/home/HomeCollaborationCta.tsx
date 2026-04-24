import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeCollaborationCta() {
  return (
    <section className="bg-[var(--color-ink)] py-16 text-white md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-6 md:px-12"
      >
        <div className="grid gap-8 border-y border-white/10 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Collaborazioni
            </span>
            <h2 className="mt-3 max-w-3xl text-3xl font-serif leading-tight md:text-5xl">
              Hai un luogo, un hotel o un progetto che merita un racconto fatto bene?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Lavoriamo con realtà travel, hospitality e lifestyle quando c&rsquo;è allineamento
              reale tra progetto, pubblico e libertà editoriale.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              to="/collaborazioni"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
            >
              Scopri le collaborazioni <ArrowRight size={14} />
            </Link>
            <Link
              to="/media-kit"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/24 px-6 text-xs font-bold uppercase tracking-widest text-white/92 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Richiedi il media kit
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
