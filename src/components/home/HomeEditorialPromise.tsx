import { motion } from 'motion/react';
import { REVEAL_EASE } from '../../lib/animations';

const PROMISES = [
  {
    label: 'Promettiamo',
    body: 'Posti che abbiamo visto, dormito, mangiato. Una sola voce, due paia di occhi, foto reali.',
  },
  {
    label: 'Non promettiamo',
    body: 'Niente "scopri il magico" niente liste di 50 cose, niente sponsor mascherati da consiglio.',
  },
  {
    label: 'Verifichiamo',
    body: 'Prezzi, orari, contatti aggiornati. Quando una cosa cambia, riapriamo il pezzo e lo annotiamo.',
  },
];

export default function HomeEditorialPromise() {
  return (
    <section
      aria-labelledby="editorial-promise-title"
      className="relative overflow-hidden bg-[var(--color-ink-deep)] py-20 text-white md:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-eyebrow !text-[var(--color-accent-on-dark)]">
            Promessa editoriale
          </span>
          <h2
            id="editorial-promise-title"
            className="mt-3 text-balance font-serif text-4xl leading-[1.05] md:text-6xl"
          >
            Quello che facciamo,{' '}
            <span className="italic text-white/55">quello che non facciamo</span>.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:mt-20 md:grid-cols-3">
          {PROMISES.map((p, idx) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: REVEAL_EASE }}
              className="bg-[var(--color-ink-deep)] p-8 md:p-10"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-on-dark)]">
                {p.label}
              </span>
              <p className="mt-5 font-serif text-2xl leading-[1.2] text-white md:text-3xl">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center font-script text-2xl text-[var(--color-accent)]/80 md:mt-14 md:text-3xl">
          — Rodrigo &amp; Betta
        </p>
      </div>
    </section>
  );
}
