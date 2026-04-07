import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
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
          className="relative rounded-[2.5rem] bg-[var(--color-ink)] p-8 text-white shadow-2xl md:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
              <Compass size={14} className="text-[var(--color-gold)]" />
              Metodo Travelliniwithus
            </div>

            <h3 className="max-w-md text-3xl font-serif leading-tight md:text-4xl">
              Dietro il progetto non ci sono stock photo.
              <span className="block text-[var(--color-gold)]">Ci sono anni di strada.</span>
            </h3>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Esperienza
                </div>
                <div className="mt-2 text-3xl font-serif text-white">
                  {BRAND_STATS.yearsOfTravel}+
                </div>
                <p className="mt-2 text-sm text-white/65">anni di viaggi reali in coppia</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Community
                </div>
                <div className="mt-2 text-3xl font-serif text-white">
                  {BRAND_STATS.instagramFollowers}
                </div>
                <p className="mt-2 text-sm text-white/65">persone che seguono il progetto</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Focus
                </div>
                <div className="mt-2 text-3xl font-serif text-white">
                  {BRAND_STATS.tiktokFollowers}
                </div>
                <p className="mt-2 text-sm text-white/65">TikTok e racconto quotidiano</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 p-6">
              <p className="text-sm font-light leading-relaxed text-white/80">
                Budget reale, food experience, weekend in coppia e luoghi fuori rotta. Il punto non
                è sembrare perfetti: il punto è farti scegliere meglio.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-3 block font-script text-xl text-[var(--color-accent)]">
            Chi siamo
          </span>
          <h2 className="text-3xl font-serif leading-tight text-ink md:text-4xl">
            Viaggiamo per scoprire posti{' '}
            <span className="text-[var(--color-accent-warm)]">che valgono.</span>
          </h2>
          <p className="mt-5 text-lg font-normal leading-relaxed text-black/70">
            Siamo Gaetano Rodrigo e Betta. Il sito nasce per mettere ordine in quello che impariamo
            viaggiando: posti visitati davvero, errori evitabili, dritte utili e scelte più sensate
            per chi parte dopo di noi.
          </p>
          <p className="mt-5 text-base font-light leading-relaxed text-black/60">
            Non vogliamo sembrarti aspirazionali a tutti i costi. Vogliamo essere utili, credibili e
            riconoscibili quando cerchi un consiglio che abbia davvero senso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Budget reale', 'Food experience', 'Viaggi in coppia', 'Posti fuori rotta'].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-[var(--color-ink)]/5 border-l-2 border-l-[var(--color-gold)] bg-[var(--color-accent-soft)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]"
                >
                  {tag}
                </span>
              )
            )}
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
