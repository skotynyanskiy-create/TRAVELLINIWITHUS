import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Map, Wallet } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import BudgetCalculator from '../components/BudgetCalculator';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { SITE_URL } from '../config/site';

const TOOL_LINKS = [
  {
    title: 'Quiz: trova il tuo viaggio',
    description: 'Tre domande per ricevere un suggerimento di itinerario calibrato.',
    href: '/quiz',
    icon: Compass,
  },
  {
    title: 'Mappa interattiva',
    description: 'Esplora le destinazioni che abbiamo verificato sul posto.',
    href: '/mappa',
    icon: Map,
  },
];

export default function Strumenti() {
  return (
    <PageLayout>
      <SEO
        title="Strumenti di viaggio"
        description="Calcolatore budget, quiz destinazione e mappa interattiva. Strumenti pratici per pianificare il prossimo viaggio con criterio."
        canonical={`${SITE_URL}/strumenti`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Strumenti' }]} />

        <div className="mt-8 max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Strumenti Travelliniwithus
          </span>
          <h1 className="mt-4 text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
            Pianifica meglio.
            <br />
            <span className="italic text-black/55">Stressati di meno.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-black/70">
            Tre strumenti pratici per arrivare a un viaggio più chiaro: capire quanto può costare,
            scegliere la direzione giusta, vedere dove siamo già stati.
          </p>
        </div>
      </Section>

      <Section className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <Wallet className="text-[var(--color-accent)]" size={22} />
            <h2 className="text-2xl font-serif">Calcolatore budget viaggio</h2>
          </div>
          <BudgetCalculator source="strumenti_page" />
        </motion.div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {TOOL_LINKS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                to={tool.href}
                className="group flex items-center justify-between gap-5 rounded-[var(--radius-lg)] border border-black/5 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[var(--color-ink)] group-hover:text-[var(--color-accent-text)]">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">{tool.description}</p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-black/35 transition-transform group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>
      </Section>
    </PageLayout>
  );
}
