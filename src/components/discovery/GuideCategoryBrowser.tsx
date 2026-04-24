import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  GUIDE_CATEGORIES,
  slugifyGuideCategory,
  type GuideCategory,
} from '../../config/contentTaxonomy';
import { getGuideCategoryVisual, getGuideCategoryVisualClass } from '../../config/guideContent';

interface GuideCategoryBrowserProps {
  categories?: readonly GuideCategory[];
  basePath?: string;
  selectedCategory?: GuideCategory | null;
  onSelect?: (category: GuideCategory | null) => void;
  /** Se true, usa Link verso /guide?cat=... invece di onSelect */
  useLinks?: boolean;
  /** Conteggi per categoria (opzionale) */
  counts?: Partial<Record<GuideCategory, number>>;
}

/** Span pattern per il mosaic grid (8 categorie) */
const spanPattern = [2, 1, 1, 2, 1, 1, 1, 1];

export default function GuideCategoryBrowser({
  categories = GUIDE_CATEGORIES,
  basePath = '/guide',
  selectedCategory,
  onSelect,
  useLinks = false,
  counts,
}: GuideCategoryBrowserProps) {
  return (
    <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
      {categories.map((category, idx) => {
        const visual = getGuideCategoryVisual(category);
        const Icon = visual.icon;
        const visualClass = getGuideCategoryVisualClass(category);
        const isActive = selectedCategory === category;
        const span = spanPattern[idx] ?? 1;
        const count = counts?.[category];

        const content = (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.45 }}
            className={`guide-card-dynamic ${visualClass} group flex h-full flex-col rounded-[1.5rem] border border-l-[3px] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              span === 2 ? 'md:col-span-2' : ''
            } ${
              isActive
                ? 'is-active border-transparent shadow-md'
                : 'border-black/6 bg-white hover:border-black/10'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div
                className={`guide-icon-dynamic flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'is-active' : ''
                }`}
              >
                <Icon size={18} />
              </div>
              {isActive && (
                <span className="guide-badge-dynamic rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                  Attivo
                </span>
              )}
              {!isActive && (
                <ArrowRight
                  size={13}
                  className="text-black/20 transition-all group-hover:translate-x-0.5"
                />
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-base font-serif leading-tight text-[var(--color-ink)] md:text-lg">
                {category}
              </h3>
              {typeof count === 'number' && count > 0 && (
                <span className="text-[10px] font-bold text-black/30">{count}</span>
              )}
            </div>

            <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-black/55">
              {visual.description}
            </p>
          </motion.div>
        );

        if (useLinks) {
          return (
            <Link
              key={category}
              to={`${basePath}?cat=${slugifyGuideCategory(category)}`}
              className={`block ${span === 2 ? 'md:col-span-2' : ''}`}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect?.(isActive ? null : category)}
            className={`block text-left ${span === 2 ? 'md:col-span-2' : ''}`}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
