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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
    const cursor = start + 2;
    pendingSelectionRef.current = { start: cursor, end: cursor };
    onChange(nextValue);
  };

  const issues = useMemo(() => lintEditorialMarkdown(value), [value]);

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
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 border-zinc-200 bg-[var(--color-muted-bg)] p-2">
        {BLOCK_SNIPPETS.map((snippet) => {
          const Icon = BLOCK_ICONS[snippet.key] ?? MapPin;
          return (
            <button
              key={snippet.key}
              type="button"
              onClick={() => insertSnippet(snippet)}
              title={snippet.description}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
            >
              <Icon size={14} />
              {snippet.label}
            </button>
          );
        })}
        <span className="mx-1 h-5 w-px bg-zinc-200" aria-hidden="true" />
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
        className="h-[420px] w-full resize-y rounded-b-lg border border-zinc-200 p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-[var(--color-accent)]"
      />

      {issues.length > 0 && (
        <div className="mt-4 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-error-text)]">
            <AlertTriangle size={14} />
            Da correggere prima di salvare
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-error-text)]">
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-muted-fg)]">
          Anteprima — così apparirà nell'articolo pubblicato
        </p>
        <div className="rounded-lg border border-zinc-200 bg-[var(--color-surface)] p-6 md:p-8">
          {value.trim() ? (
            <div className="article-body prose-reset">
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
  );
}
