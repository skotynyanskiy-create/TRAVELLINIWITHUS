import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, User, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ArticleData } from './types';
import { trackEvent } from '../../services/analytics';

interface ReadingModeProps {
  article: ArticleData;
  authorName: string;
  readingTime: string;
  open: boolean;
  onClose: () => void;
}

export default function ReadingMode({
  article,
  authorName,
  readingTime,
  open,
  onClose,
}: ReadingModeProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    trackEvent('article_reading_mode_open', { slug: article.title });

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, article.title]);

  if (typeof window === 'undefined') return null;

  const node = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Modalita lettura"
          className="fixed inset-0 z-[150] overflow-y-auto bg-[var(--color-surface)]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi modalita lettura"
            className="fixed right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/95 text-[var(--color-ink)] shadow-[var(--shadow-md)] backdrop-blur-md transition-all hover:border-[var(--color-ink)] md:right-10 md:top-10"
          >
            <X size={18} />
          </button>

          <motion.article
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[68ch] px-6 py-20 md:px-10 md:py-28"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Modalita lettura · {article.category}
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-6xl">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-[var(--color-border)] pb-6 text-sm text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {authorName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {readingTime}
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.date}</span>
            </div>

            <div className="mt-10 space-y-6 text-lg leading-[1.75] text-[var(--color-ink-2)] [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-[var(--color-ink)] [&_h3]:mt-9 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-[var(--color-ink)] [&_p]:text-[1.0625rem] [&_strong]:font-semibold [&_strong]:text-[var(--color-ink)]">
              {typeof article.content === 'string' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
              ) : (
                article.content
              )}
            </div>

            <div className="mt-16 border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-muted)]">
              Premi{' '}
              <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono">
                ESC
              </kbd>{' '}
              o il pulsante X per tornare al sito.
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
