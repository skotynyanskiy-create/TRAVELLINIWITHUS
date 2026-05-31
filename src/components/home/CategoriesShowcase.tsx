import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from '../Section';
import { EXPERIENCE_TYPES, slugifyExperienceType } from '../../config/contentTaxonomy';
import { getExperienceVisual } from '../../config/experienceVisuals';

const NEW_CATEGORIES = new Set(['Escape Room', 'Parchi divertimento', 'Itinerari']);

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Posti particolari': 'Indirizzi curiosi e scorci fuori dall\'ordinario.',
  'Food & Ristoranti': 'Ristoranti e tavole che meritano una deviazione.',
  'Locali insoliti': 'Posti con atmosfera e concept memorabile.',
  'Escape Room': 'Le migliori in Italia e in Europa, recensite sul campo.',
  'Parchi divertimento': 'Da Gardaland a Disneyland: guide complete.',
  'Itinerari': 'Percorsi costruiti sul campo con tempi reali.',
  'Hotel con carattere': 'Strutture dove il design fa parte dell\'esperienza.',
  'Weekend romantici': 'Idee in coppia con un taglio utile e concreto.',
  'Borghi e città d\'arte': 'Centri storici con fascino e patrimonio vero.',
  'Passeggiate panoramiche': 'Percorsi e viste che valgono il viaggio.',
  'Relax, terme e spa': 'Pause lente e benessere con più criterio.',
  'Esperienze insolite': 'Attività particolari da salvare proprio perché diverse.',
  'Gite e day trip': 'Uscite facili per una giornata o un weekend vicino.',
};

const featured = EXPERIENCE_TYPES.filter((t) => NEW_CATEGORIES.has(t));
const rest = EXPERIENCE_TYPES.filter((t) => !NEW_CATEGORIES.has(t));

export default function CategoriesShowcase() {
  return (
    <Section
      title="Esplora per categoria"
      subtitle="Cosa vuoi vivere?"
      className="bg-[var(--color-sand)]"
      ornament
    >
      {/* Featured new categories — larger cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {featured.map((category, idx) => {
          const visual = getExperienceVisual(category);
          const Icon = visual.icon;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
            >
              <Link
                to={`/esperienze?type=${slugifyExperienceType(category)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: visual.colorLight, borderLeft: `4px solid ${visual.color}` }}
              >
                <span
                  className="mb-5 inline-block self-start rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white"
                  style={{ backgroundColor: visual.color }}
                >
                  Novità
                </span>
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${visual.color}20` }}
                >
                  <Icon size={24} style={{ color: visual.color }} />
                </div>
                <h3 className="mb-2 text-xl font-serif text-[var(--color-ink)]">{category}</h3>
                <p className="mb-5 text-sm font-normal leading-relaxed text-black/60">
                  {CATEGORY_DESCRIPTIONS[category]}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: visual.color }}>
                  Scopri <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* All other categories — compact pill grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {rest.map((category, idx) => {
          const visual = getExperienceVisual(category);
          const Icon = visual.icon;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              <Link
                to={`/esperienze?type=${slugifyExperienceType(category)}`}
                className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-md"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: visual.colorLight }}
                >
                  <Icon size={16} style={{ color: visual.color }} />
                </div>
                <span className="text-sm font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                  {category}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/esperienze"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/10 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm transition-all hover:bg-[var(--color-ink)] hover:text-white"
        >
          Tutte le esperienze <ArrowRight size={14} />
        </Link>
      </div>
    </Section>
  );
}
