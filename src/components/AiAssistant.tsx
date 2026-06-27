import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { trackEvent } from '../services/analytics';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'm-0',
  role: 'assistant',
  content:
    'Ciao, sono l assistente Travelliniwithus. Posso aiutarti a trovare itinerari, luoghi particolari o guide coerenti con il viaggio che hai in mente.',
};

const QUICK_PROMPTS = [
  'Itinerario weekend in Italia',
  'Dove andare in Andalusia?',
  'Posti insoliti da scoprire',
];

const KEYWORD_RESPONSES: { match: string[]; reply: string }[] = [
  {
    match: ['weekend italia', 'italia weekend', 'weekend in italia', 'short italia'],
    reply:
      'Per un weekend in Italia: "Dolomiti slow in 3 giorni" (boutique + sentiero panoramico) o "Sicilia orientale in 5 giorni" da Catania a Taormina. Quale tono cerchi?',
  },
  {
    match: ['italia', 'sicilia', 'catania', 'dolomiti', 'taormina'],
    reply:
      'In Italia abbiamo due itinerari pronti: "Sicilia orientale 5 giorni" e "Dolomiti slow 3 giorni". C e anche la guida PDF "Weekend a Catania" che approfondisce il food.',
  },
  {
    match: ['andalusia', 'spagna', 'siviglia', 'cordoba'],
    reply:
      'Per l Andalusia abbiamo un itinerario weekend (4 giorni Siviglia + Cordoba) e una guida estesa di 7 giorni. Ti porto a quello che ti serve?',
  },
  {
    match: ['dolomiti', 'montagna', 'rifugio'],
    reply:
      'Sulle Dolomiti abbiamo l\'itinerario "Dolomiti slow in 3 giorni" — boutique, sentiero panoramico e una malga. E poi un articolo collegato con rifugi di design.',
  },
  {
    match: ['weekend', 'breve', 'corto'],
    reply:
      'Per un weekend lungo: "Andalusia weekend" (4 giorni Siviglia + Cordoba) o "Dolomiti slow" (3 giorni boutique). Vuoi qualcosa in Italia o all estero?',
  },
  {
    match: ['budget', 'costo', 'prezzo', 'quanto', 'spesa'],
    reply:
      'Per i costi preferiamo indicazioni dentro guide e itinerari, quando hanno senso: ti aiutano a capire stagione, ritmo e tipo di esperienza senza trasformare tutto in un calcolatore generico.',
  },
  {
    match: ['insoliti', 'particolari', 'segreti', 'nascosti'],
    reply:
      'Posti particolari e il nostro mestiere. Apri /esplora filtrato per "Posti particolari" oppure il blog: ogni articolo cita almeno un luogo non ovvio.',
  },
  {
    match: ['guida', 'pdf', 'planner', 'shop'],
    reply:
      'Le guide digitali stanno in /shop. Alcune sono ancora in preparazione: quando sono pronte trovi scheda, prezzo e stato di disponibilita. Se viaggi spesso, tieni d occhio anche il Travellini Club.',
  },
];

const FALLBACK_REPLY =
  'Non ho ancora abbastanza contesto per rispondere bene. Intanto puoi aprire la mappa interattiva /mappa oppure esplorare gli articoli da /esplora.';

function matchReply(message: string): string {
  const text = message.toLowerCase();
  // Score by number of keyword matches: piu keyword match = entry piu specifica = vince.
  let bestEntry: (typeof KEYWORD_RESPONSES)[number] | null = null;
  let bestScore = 0;
  for (const entry of KEYWORD_RESPONSES) {
    const score = entry.match.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  return bestEntry ? bestEntry.reply : FALLBACK_REPLY;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);

  const nextId = (suffix: string) => {
    idCounterRef.current += 1;
    return `m-${idCounterRef.current}-${suffix}`;
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleToggle = () => {
    // Fire side-effect (analytics) outside the updater so React 19 StrictMode
    // double-invocation of the updater doesn't emit duplicate events.
    setIsOpen((prev) => !prev);
    trackEvent(isOpen ? 'ai_assistant_close' : 'ai_assistant_open');
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = {
      id: nextId('u'),
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Marathon FASE 2.A: prova prima endpoint RAG, fallback su keyword matching demo.
    // Endpoint ritorna 503 quando API keys non configurate (mode 'disabled').
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const response = await fetch('/api/ai-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, history: messages.slice(-4) }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as { reply?: string; sources?: unknown };
        if (data.reply && typeof data.reply === 'string') {
          trackEvent('ai_assistant_message', {
            length: trimmed.length,
            demo: false,
            has_sources: Array.isArray(data.sources) && data.sources.length > 0,
          });
          setMessages((prev) => [
            ...prev,
            { id: nextId('a'), role: 'assistant', content: data.reply ?? '' },
          ]);
          setIsThinking(false);
          return;
        }
      }
      // Non-ok response → fallback demo (silenzioso, no error visibile in UI).
      throw new Error('ai-companion-unavailable');
    } catch {
      trackEvent('ai_assistant_message', { length: trimmed.length, demo: true });
      // Fallback su keyword matching demo (preserva UX se backend non pronto).
      setTimeout(() => {
        const replyContent = matchReply(trimmed);
        setMessages((prev) => [
          ...prev,
          { id: nextId('a'), role: 'assistant', content: replyContent },
        ]);
        setIsThinking(false);
      }, 400);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'Chiudi assistente' : 'Apri assistente viaggio'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[70] hidden h-16 w-16 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-all hover:bg-[var(--color-accent)] md:flex"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Assistente viaggio Travelliniwithus"
            className="fixed inset-x-4 bottom-24 z-[71] flex max-h-[68vh] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-black/10 bg-white shadow-2xl sm:right-6 sm:left-auto sm:bottom-28 sm:w-[380px] md:right-8"
          >
            <header className="flex items-start justify-between gap-3 border-b border-black/5 bg-[var(--color-ink)] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Assistente Travelliniwithus
                  </p>
                  <p className="mt-1 font-serif text-lg leading-tight">Domande veloci</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Chiudi"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X size={14} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-[var(--color-sand)] p-5"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[var(--radius-md)] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-[var(--color-ink)] text-white'
                        : 'bg-white text-[var(--color-ink)]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="rounded-[var(--radius-md)] bg-white px-4 py-3 shadow-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent)]" />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent)]"
                        style={{ animationDelay: '120ms' }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent)]"
                        style={{ animationDelay: '240ms' }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 border-t border-black/5 bg-white px-5 py-3">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-black/5 bg-white p-4"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Cosa vuoi sapere?"
                className="flex-1 rounded-full border border-black/10 bg-[var(--color-sand)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Invia"
                disabled={!input.trim() || isThinking}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
