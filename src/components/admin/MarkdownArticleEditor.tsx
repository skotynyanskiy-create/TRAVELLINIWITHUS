import { useEffect, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  Clapperboard,
  HelpCircle,
  Link2,
  Map,
  MapPin,
  Receipt,
  Scale,
} from 'lucide-react';
import { ArticleBody } from '../../pages/Articolo';
import type { ArticleData } from '../article';
import {
  BLOCK_SNIPPETS,
  INLINE_SNIPPET,
  buildSnippetInsertion,
  countDirectiveUsage,
  lintEditorialMarkdown,
  type DirectiveSnippet,
} from './markdownEditorTools';

const BLOCK_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  posto: MapPin,
  verdetto: Scale,
  reel: Clapperboard,
  dati: Receipt,
  mappa: Map,
  domande: HelpCircle,
};

interface MarkdownArticleEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  previewMeta: {
    title: string;
    description: string;
    image: string;
    category: string;
    location: string;
    period: string;
    budget: string;
  };
  /** Chiamata a ogni cambio con l'elenco corrente degli errori di lint: la
   *  pagina che monta l'editor la usa per mostrare "N cose da correggere" e
   *  bloccare la pubblicazione (mai il salvataggio, che resta sempre libero). */
  onIssuesChange?: (issues: string[]) => void;
}

/**
 * Sostituisce ReactQuill: l'editor scrive markdown vero, l'unico formato che
 * `ArticleBody` (src/pages/Articolo.tsx) sa rendere — non c'e' `rehype-raw`
 * nel repo, quindi l'HTML che ReactQuill salvava finiva a schermo come testo
 * letterale sulla pagina pubblica. L'anteprima qui sotto usa lo stesso
 * `ArticleBody` del sito pubblico: non e' una riproduzione approssimata.
 */
export default function MarkdownArticleEditor({
  id,
  value,
  onChange,
  previewMeta,
  onIssuesChange,
}: MarkdownArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /* Ref, non state: la selezione va applicata dopo che il textarea ha
     ricevuto il nuovo `value` dal genitore, ma non deve innescare un altro
     render — set(Selection) e' un effetto collaterale sul DOM, non dati React. */
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending || !textareaRef.current) return;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(pending.start, pending.end);
    pendingSelectionRef.current = null;
  }, [value]);

  const insertSnippet = (snippet: DirectiveSnippet) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { nextValue, selectionStart, selectionEnd } = buildSnippetInsertion(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      snippet
    );
    pendingSelectionRef.current = { start: selectionStart, end: selectionEnd };
    onChange(nextValue);
  };

  /* Tab indenta, ma non puo' essere l'unica uscita dal campo: una textarea che
     trattiene il focus in entrambe le direzioni e' una trappola da tastiera
     (WCAG 2.1.2) e il gate a11y della CI e' bloccante a 0,95.
     Quindi: Shift+Tab ed Escape escono sempre, e Tab indenta solo quando non
     c'e' nulla di selezionato — altrimenti cancellerebbe il testo scelto senza
     che l'annulla nativo possa riportarlo indietro (il campo e' controllato). */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      return;
    }
    if (e.key !== 'Tab' || e.shiftKey) return;

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) return;

    e.preventDefault();
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
    const cursor = start + 2;
    pendingSelectionRef.current = { start: cursor, end: cursor };
    onChange(nextValue);
  };

  const issues = useMemo(() => lintEditorialMarkdown(value), [value]);
  const usage = useMemo(() => countDirectiveUsage(value), [value]);

  useEffect(() => {
    onIssuesChange?.(issues);
  }, [issues, onIssuesChange]);

  const previewArticle: ArticleData = {
    title: previewMeta.title || 'Anteprima',
    description: previewMeta.description,
    image: previewMeta.image,
    category: previewMeta.category || 'Guide',
    date: 'Anteprima',
    location: previewMeta.location || 'Italia',
    period: previewMeta.period || 'Sempre',
    budget: previewMeta.budget || 'Medio',
    content: value,
    isMarkdown: true,
  };

  return (
    /* @container: la larghezza reale disponibile qui non e' quella della
       finestra. `ArticleEditor.tsx` incapsula questo componente in
       <Section className="max-w-4xl ..."> dentro un <Section> che aggiunge a
       sua volta max-w-7xl + padding — il risultato e' un tetto fisso intorno
       a 800px di contenuto, raggiunto gia' a finestre di medie dimensioni e
       mai superato oltre. Una media query sulla viewport indovinerebbe quel
       tetto; una container query lo misura. */
    <div className="@container">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-[var(--color-muted-bg)] p-2">
        <span className="text-eyebrow mr-0.5 shrink-0">Blocchi</span>
        {BLOCK_SNIPPETS.map((snippet) => {
          const Icon = BLOCK_ICONS[snippet.key] ?? MapPin;
          const used = usage[snippet.key] || 0;
          const atQuota = snippet.maxCount !== undefined && used >= snippet.maxCount;
          return (
            <button
              key={snippet.key}
              type="button"
              onClick={() => insertSnippet(snippet)}
              title={`${snippet.description}${
                snippet.maxCount !== undefined ? ` Quota consigliata: ${snippet.maxCount}.` : ''
              }`}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
            >
              <Icon size={14} />
              {snippet.label}
              {snippet.maxCount !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] font-semibold ${
                    atQuota
                      ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]'
                      : 'bg-[var(--color-muted-bg-2)] text-[var(--color-muted-fg-2)]'
                  }`}
                >
                  {used}/{snippet.maxCount}
                </span>
              )}
            </button>
          );
        })}
        <span className="mx-1 h-5 w-px bg-zinc-200" aria-hidden="true" />
        <span className="text-eyebrow mr-0.5 shrink-0">In linea</span>
        <button
          type="button"
          onClick={() => insertSnippet(INLINE_SNIPPET)}
          title={INLINE_SNIPPET.description}
          className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
        >
          <Link2 size={14} />
          {INLINE_SNIPPET.label}
        </button>
      </div>

      {/* Sotto 48rem (768px) di larghezza reale il campo e l'anteprima restano
          impilati: e' gia' il caso di ogni schermo da telefono, e sotto quella
          soglia due colonne affiancate sarebbero piu' strette di uno smartphone
          in verticale, quindi illeggibili invece che utili. Da 48rem in su —
          raggiunto qui gia' a finestre desktop di media larghezza, mai oltre
          circa 800px per il tetto del genitore descritto sopra — restano due
          colonne con ~370px l'una, sufficienti per scrivere e leggere insieme,
          ciascuna con lo scorrimento suo. */}
      <div className="mt-3 @min-[48rem]:grid @min-[48rem]:grid-cols-2 @min-[48rem]:items-start @min-[48rem]:gap-6">
        <div>
          <textarea
            ref={textareaRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck
            placeholder={
              'Scrivi qui in markdown.\n\n## Un titolo di sezione\n\nUn paragrafo di testo normale.'
            }
            className="h-[420px] w-full resize-y rounded-lg border border-zinc-200 p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-[var(--color-accent)] @min-[48rem]:h-[560px]"
          />

          {issues.length > 0 && (
            <div className="mt-4 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-error-text)]">
                <AlertTriangle size={14} />
                Da correggere prima di pubblicare
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-error-text)]">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 @min-[48rem]:mt-0">
          <p className="text-eyebrow mb-3">Anteprima — così apparirà nell'articolo pubblicato</p>
          <div className="rounded-lg border border-zinc-200 bg-[var(--color-surface)] p-6 md:p-8 @min-[48rem]:h-[560px] @min-[48rem]:overflow-y-auto">
            {value.trim() ? (
              /* max-w-[720px]: la larghezza reale della colonna di testo su
                 `Articolo.tsx` (max-w-6xl 1152px, meno il padding del
                 contenitore, meno sidebar 320px + gap-12 nel layout a due
                 colonne da xl in su) — non e' arrotondata, e' quella cifra.
                 Senza questo vincolo l'anteprima usa tutta la larghezza del
                 pannello e mostra righe piu' lunghe di quelle online: chi
                 scrive giudicherebbe il ritmo dei paragrafi su una misura
                 falsa. */
              <div className="article-body prose-reset mx-auto max-w-[720px]">
                <ArticleBody article={previewArticle} />
              </div>
            ) : (
              <p className="text-sm italic text-[var(--color-muted-fg)]">
                Inizia a scrivere per vedere l'anteprima qui.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
