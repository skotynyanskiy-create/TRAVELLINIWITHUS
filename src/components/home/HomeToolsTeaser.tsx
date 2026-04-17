import { motion } from 'motion/react';
import { ArrowRight, Camera, Plane, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOOL_ITEMS = [
  {
    icon: Plane,
    title: 'Prenotare meglio',
    text: 'Servizi e riferimenti che usiamo per voli, hotel, attività e logistica.',
  },
  {
    icon: Smartphone,
    title: 'Strumenti digitali',
    text: 'App utili per organizzare, pagare, connettersi e muoversi con meno attrito.',
  },
  {
    icon: Camera,
    title: 'Gear essenziale',
    text: 'Attrezzatura scelta per viaggiare leggeri e raccontare meglio i luoghi.',
  },
];

export default function HomeToolsTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-7xl gap-8 px-6 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Strumenti utili
          </span>
          <h2 className="mt-3 max-w-xl text-3xl font-serif leading-tight text-ink md:text-5xl">
            Poche risorse, scelte per viaggiare meglio.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-black/62">
            Non una vetrina di link: solo strumenti, app e attrezzatura che hanno senso dentro il
            modo in cui viaggiamo e raccontiamo.
          </p>
          <Link
            to="/risorse"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Apri gli strumenti <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {TOOL_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to="/risorse"
                className="group rounded-lg border border-black/8 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-serif text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/56">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black/42 transition-colors group-hover:text-[var(--color-accent)]">
                  Vai alle risorse <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
