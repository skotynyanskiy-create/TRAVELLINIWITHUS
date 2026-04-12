import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import Section from '../Section';
import { BRAND_STATS } from '../../config/site';

export default function AboutPreview() {
  return (
    <Section className="bg-white">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              {/* TODO: sostituire con foto reale di Rodrigo */}
              <OptimizedImage
                // TODO(@travelliniwithus): PLACEHOLDER — servono ritratto Rodrigo
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
                alt="Rodrigo — Travelliniwithus"
                className="aspect-4/5 w-full rounded-tr-[3rem] rounded-bl-[3rem] object-cover shadow-lg ring-1 ring-[var(--color-gold)]/10"
              />
            </div>
            <div className="space-y-4">
              {/* TODO: sostituire con foto reale di Betta */}
              <OptimizedImage
                // TODO(@travelliniwithus): PLACEHOLDER — servono ritratto Betta
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
                alt="Betta — Travelliniwithus"
                className="aspect-4/5 w-full rounded-tl-[3rem] rounded-br-[3rem] object-cover shadow-lg ring-1 ring-[var(--color-gold)]/10"
              />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-gold)]/30 bg-[var(--color-gold-soft)] p-5 backdrop-blur-md shadow-[0_0_30px_rgba(196,164,124,0.15)]">
            <Compass className="h-8 w-8 text-[var(--color-gold)]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-3 block font-script text-xl text-[var(--color-accent)]">Chi siamo</span>
          <h2 className="text-3xl font-serif leading-tight text-ink md:text-4xl">
            Viaggiamo per scoprire posti <span className="text-[var(--color-accent-warm)]">che valgono.</span>
          </h2>
          <p className="mt-5 text-lg font-normal leading-relaxed text-black/70">
            Siamo Gaetano Rodrigo & Betta, travel couple con {BRAND_STATS.yearsOfTravel} anni di viaggi in coppia.
            Budget travel, food experience, posti veri — solo luoghi che abbiamo testato di persona.
          </p>
          <p className="mt-6 font-script text-lg text-[var(--color-gold)]">
            "Viaggiare bene non serve spendere tanto."
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Budget travel', 'Food experience', 'Weekend in coppia', 'Posti particolari'].map((tag) => (
              <span key={tag} className="rounded-lg border border-[var(--color-ink)]/5 border-l-2 border-l-[var(--color-gold)] bg-[var(--color-accent-soft)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
                {tag}
              </span>
            ))}
          </div>
          <Link
            to="/chi-siamo"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-all hover:text-[var(--color-accent-warm)] hover:gap-4"
          >
            Scopri la nostra storia
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}
