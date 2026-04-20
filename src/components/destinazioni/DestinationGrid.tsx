import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import ArticleSkeleton from '../ArticleSkeleton';
import EmptyState from '../EmptyState';
import OptimizedImage from '../OptimizedImage';
import Pagination from '../Pagination';
import { DEMO_DESTINATION_CARD } from '../../config/demoContent';
import { getExperienceVisual } from '../../config/experienceVisuals';
import { getArchiveLocationLabel, type ArchiveItem } from '../../utils/contentArchive';

function ArchiveCard({ item, isDemo }: { item: ArchiveItem; isDemo: boolean }) {
  const visual = item.primaryExperience ? getExperienceVisual(item.primaryExperience) : null;
  const ExpIcon = visual?.icon;

  return (
    <Link
      to={item.link}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isDemo && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/60 backdrop-blur">
              Preview
            </span>
          )}
          {item.primaryExperience && ExpIcon && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/70 backdrop-blur"
            >
              <ExpIcon size={12} style={{ color: visual.color }} />
              {item.primaryExperience}
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            <MapPin size={12} />
            {getArchiveLocationLabel(item)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
          {item.period && <span>{item.period}</span>}
          {item.duration && <span>{item.duration}</span>}
          {item.budget && <span>{item.budget}</span>}
        </div>
        <h2 className="text-2xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
          {item.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-black/65">
          {item.excerpt ||
            'Un contenuto da salvare per capire atmosfera, logistica e dettagli utili prima di partire.'}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Leggi e salva <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

interface DestinationGridProps {
  paginatedItems: ArchiveItem[];
  filteredCount: number;
  archiveCount: number;
  isLoading: boolean;
  usingDemo: boolean;
  hasActiveFilters: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

export default function DestinationGrid({
  paginatedItems,
  filteredCount,
  archiveCount,
  isLoading,
  usingDemo,
  hasActiveFilters,
  currentPage,
  totalPages,
  onPageChange,
  onReset,
}: DestinationGridProps) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {filteredCount} contenuti trovati
          </span>
          <h2 className="mt-2 text-3xl font-serif text-[var(--color-ink)]">
            {hasActiveFilters ? 'Risultati filtrati con criterio' : 'Ultimi luoghi da esplorare'}
          </h2>
        </div>
        <Link
          to="/esperienze"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]"
        >
          Cerca per esperienza <ArrowRight size={14} />
        </Link>
      </div>

      {usingDemo && (
        <div className="mb-8 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
          Questa è una preview editoriale temporanea: serve a mostrare il layout finché non ci
          sono contenuti reali pubblicati. Prima del deploy pubblico va sostituita o disattivata.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ArticleSkeleton key={item} />
          ))}
        </div>
      ) : filteredCount === 0 ? (
        <EmptyState
          variant={archiveCount === 0 ? 'no-content' : 'no-results'}
          onReset={archiveCount > 0 ? onReset : undefined}
        />
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <ArchiveCard item={item} isDemo={usingDemo && item.id === DEMO_DESTINATION_CARD.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </>
  );
}
