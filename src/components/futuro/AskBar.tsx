import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AskBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onClear: () => void;
  hasResults: boolean;
  resultCount: number;
}

/**
 * Barra "Chiedi" — campo naturale per il concierge Atlante Notturno.
 * Mobile-first: sticky in thumb-zone (bottom su mobile, top-hero su desktop).
 * Niente spinner: il movimento delle card È la risposta.
 */
export function AskBar({
  value,
  onChange,
  onSubmit,
  onClear,
  hasResults,
  resultCount,
}: AskBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(value);
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      onClear();
      inputRef.current?.blur();
    }
  }

  return (
    <div className="atlante-askbar-wrap w-full max-w-2xl mx-auto px-4 md:px-0">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1.5px rgba(255, 91, 46, 0.6), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 0 0 1px rgba(46, 40, 32, 0.8), 0 4px 20px rgba(0,0,0,0.4)',
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{ background: '#16130F' }}
      >
        <Search
          size={18}
          className="flex-shrink-0 transition-colors duration-200"
          style={{ color: focused ? '#FF5B2E' : '#6E665A' }}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="weekend romantico insolito sotto 250€…"
          aria-label="Chiedi dove andare"
          className="flex-1 bg-transparent outline-none text-base font-sans placeholder:text-[#6E665A] min-w-0"
          style={{ color: '#F4EEE3' }}
        />

        <AnimatePresence mode="wait">
          {value && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={onClear}
              aria-label="Cancella ricerca"
              className="flex-shrink-0 rounded-full p-1 transition-colors"
              style={{ color: '#6E665A' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F4EEE3')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#6E665A')}
            >
              <X size={15} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feedback risultati — minimalista, niente spinner */}
      <AnimatePresence>
        {value.trim() && (
          <motion.p
            key="feedback"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-2 text-xs font-sans text-center"
            style={{ color: '#6E665A' }}
            aria-live="polite"
          >
            {hasResults
              ? `${resultCount} ${resultCount === 1 ? 'posto trovato' : 'posti trovati'}`
              : 'Nessun posto corrisponde — prova con zona, tipo o budget'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
