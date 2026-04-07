import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import TableOfContents from './TableOfContents';
import type { TocItem } from './types';

interface MobileTocOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tocItems: TocItem[];
}

export default function MobileTocOverlay({ isOpen, onClose, tocItems }: MobileTocOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 lg:hidden" role="dialog" aria-modal="true" aria-label="Indice dei contenuti">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-[var(--color-sand)] rounded-t-3xl p-10 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h4 className="font-serif text-3xl">Indice</h4>
              <button
                onClick={onClose}
                aria-label="Chiudi indice"
                className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black"
              >
                <X size={24} />
              </button>
            </div>

            <TableOfContents items={tocItems} onItemClick={onClose} variant="mobile-overlay" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
