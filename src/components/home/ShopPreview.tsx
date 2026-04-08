import { motion } from 'motion/react';
import { ArrowRight, Compass, Mail, NotebookPen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Newsletter from '../Newsletter';
import type { HomeContent } from '../../config/siteContent';

interface UtilityPreviewProps {
  content: HomeContent['utility'];
}

export default function UtilityPreview({ content }: UtilityPreviewProps) {
  return (
    <section id="newsletter" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.78fr)] lg:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-accent)]">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 max-w-4xl text-4xl font-serif leading-[1.02] text-[var(--color-ink)] md:text-5xl lg:text-[3.7rem]">
              {content.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-black/65">{content.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[2.2rem] bg-[var(--color-ink)] p-8 text-white shadow-[var(--shadow-premium)] md:p-10"
          >
            <div className="absolute inset-0 bg-topo opacity-12" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent-glow),transparent_32%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/76">
                <Mail size={14} className="text-[var(--color-gold)]" />
                {content.newsletterLabel}
              </div>
              <h3 className="mt-6 max-w-xl text-3xl font-serif leading-tight md:text-4xl">
                {content.newsletterTitle}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                {content.newsletterDescription}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/62">
                {content.newsletterProofLine}
              </p>

              <div className="mt-8 max-w-xl rounded-[1.8rem] border border-white/10 bg-white/7 p-5 backdrop-blur-md">
                <Newsletter compact source={content.newsletterSource} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.65 }}
            className="rounded-[2.2rem] border border-black/5 bg-[var(--color-sand)] p-6 shadow-sm md:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">
                  {content.resourcesLabel}
                </div>
                <h3 className="mt-3 text-3xl font-serif leading-tight text-[var(--color-ink)]">
                  {content.resourcesTitle}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
                <Compass size={22} />
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed text-black/66">
              {content.resourcesDescription}
            </p>

            <div className="mt-6 grid gap-4">
              {[
                'Prenotare meglio con pochi servizi davvero utili.',
                'Strumenti digitali che semplificano il viaggio invece di aggiungere rumore.',
                'Gear e attrezzatura raccontati con un perche, non come vetrina.',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.4rem] border border-black/5 bg-white px-5 py-4"
                >
                  <NotebookPen size={16} className="mt-1 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/60">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-black/5 bg-white/90 px-5 py-4 text-sm leading-relaxed text-black/60">
              {content.resourcesNote}
            </div>

            <Link
              to={content.resourcesCta.link}
              className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all hover:gap-3 hover:text-[var(--color-accent-warm)]"
            >
              {content.resourcesCta.label}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
