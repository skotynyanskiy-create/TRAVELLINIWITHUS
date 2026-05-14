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
    'Ciao, sono l assistente Travelliniwithus (demo). Posso aiutarti a trovare itinerari, calcolare il budget o suggerirti destinazioni in base ai tuoi articoli letti.',
};

const QUICK_PROMPTS = [
  'Itinerario weekend in Italia',
  'Quanto costa una settimana in Andalusia?',
  'Posti insoliti da scoprire',
];

const KEYWORD_RESPONSES: { match: string[]; reply: string }[] = [
  {
    match: ['weekend', 'breve', 'corto'],
    reply:
      'Per un weekend lungo ti suggerirei l itinerario "Andalusia weekend" — 4 giorni tra Siviglia e Cordoba. Ti porto alla scheda?',
  },
  {
    match: ['italia', 'sicilia', 'catania'],
    reply:
      'Per Italia, la nostra base e l itinerario "Sicilia orientale in 5 giorni" da Catania a Taormina. C e anche la guida PDF "Weekend a Catania" che approfondisce il food.',
  },
  {
    match: ['budget', 'costo', 'prezzo', 'quanto', 'spesa'],
    reply:
      'Apri il calcolatore budget in /strumenti: ti chiede durata, area e stile e ti da una stima realistica con voli, alloggi, cibo e spostamenti.',
  },
  {
    match: ['dolomiti', 'montagna', 'rifugio'],
    reply:
      'Sulle Dolomiti abbiamo l itinerario "Dolomiti slow in 3 giorni" — boutique, sentiero panoramico e una malga. E poi un articolo collegato con rifugi di design.',
  },
  {
    match: ['andalusia', 'spagna', 'siviglia', 'cordoba'],
    reply:
      'Per l Andalusia abbiamo un itinerario weekend (4 giorni Siviglia + Cordoba) e una guida estesa di 7 giorni. Ti porto a quello che ti serve?',
  },
  {
    match: ['insoliti', 'particolari', 'segreti', 'nascosti'],
    reply:
      'Posti particolari e il nostro mestiere. Apri /destinazioni filtrato per "Posti particolari" oppure il blog: ogni articolo cita almeno un luogo non ovvio.',
  },
  {
    match: ['guida', 'pdf', 'planner', 'shop'],
    reply:
      'Tutte le guide digitali stanno in /shop. La piu venduta in demo e "Weekend a Catania". Se viaggi spesso, valuta il Travellini Club per accesso a tutte.',
  },
];

const FALLBACK_REPLY =
  'Questa e una demo: presto l assistente sara collegato ai contenuti reali del sito. Intanto puoi fare il quiz su /quiz oppure aprire la mappa interattiva /mappa.';

function matchReply(message: string): string {
  const text = message.toLowerCase();
  const match = KEYWORD_RESPONSES.find((entry) =>
    entry.match.some((keyword) => text.includes(keyword))
  );
  return match ? match.reply : FALLBACK_REPLY;
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
    setIsOpen((prev) => {
      const next = !prev;
      trackEvent(next ? 'ai_assistant_open' : 'ai_assistant_close');
      return next;
    });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage = {
      id: nextId('u'),
      role: 'user',
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    trackEvent('ai_assistant_message', { length: text.trim().length, demo: true });

    setTimeout(() => {
      const replyContent = matchReply(text);
      setMessages((prev) => [
        ...prev,
        { id: nextId('a'), role: 'assistant', content: replyContent },
      ]);
      setIsThinking(false);
    }, 700);
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
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-all hover:bg-[var(--color-accent)] md:bottom-8 md:right-8 md:h-16 md:w-16"
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
            className="fixed inset-x-4 bottom-24 z-[71] flex max-h-[68vh] flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl sm:right-6 sm:left-auto sm:bottom-28 sm:w-[380px] md:right-8"
          >
            <header className="flex items-start justify-between gap-3 border-b border-black/5 bg-[var(--color-ink)] p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    Assistente Travelliniwithus
                  </p>
                  <p className="mt-1 font-serif text-lg leading-tight">Domande veloci · demo</p>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
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
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
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
