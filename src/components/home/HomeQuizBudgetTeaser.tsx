import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Wallet } from 'lucide-react';

export default function HomeQuizBudgetTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-12 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Strumenti pratici
          </span>
          <h2 className="mt-4 text-4xl font-serif leading-tight tracking-tight md:text-5xl">
            Non sai da dove partire?{' '}
            <span className="italic text-black/55">Te lo diciamo noi.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-black/65">
            Quiz veloci e calcolatori usati da chi viaggia con criterio. Niente form, niente
            registrazione: solo le risposte giuste per orientarti.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TeaserCard
            icon={Compass}
            eyebrow="Quiz viaggio"
            title="Trova il prossimo viaggio in 3 domande"
            description="Tempo, ritmo, budget. Ricevi un itinerario suggerito calibrato sulle tue risposte."
            cta="Inizia il quiz"
            to="/quiz"
            accent
          />
          <TeaserCard
            icon={Wallet}
            eyebrow="Budget viaggio"
            title="Quanto puo costare davvero il prossimo viaggio?"
            description="Stima realistica con voli, alloggi, cibo e spostamenti. Per orientarti prima di prenotare."
            cta="Calcola la stima"
            to="/strumenti"
          />
        </div>
      </div>
    </section>
  );
}

interface TeaserCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  accent?: boolean;
}

function TeaserCard({ icon: Icon, eyebrow, title, description, cta, to, accent }: TeaserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`group flex flex-col justify-between gap-8 rounded-[2rem] border p-8 transition-all hover:-translate-y-1 md:p-10 ${
        accent
          ? 'border-[var(--color-accent)]/20 bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/95'
          : 'border-black/5 bg-white text-[var(--color-ink)] hover:border-[var(--color-accent)]'
      }`}
    >
      <div>
        <div
          className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
            accent
              ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
              : 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
          }`}
        >
          <Icon size={22} />
        </div>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
            accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-text)]'
          }`}
        >
          {eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">{title}</h3>
        <p
          className={`mt-4 max-w-md text-base leading-relaxed ${
            accent ? 'text-white/70' : 'text-black/62'
          }`}
        >
          {description}
        </p>
      </div>
      <Link
        to={to}
        className={`inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
          accent
            ? 'bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-white'
            : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]'
        }`}
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
