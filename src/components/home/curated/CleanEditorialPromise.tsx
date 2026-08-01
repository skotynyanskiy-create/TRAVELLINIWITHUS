import { CheckCircle2, DollarSign, HeartHandshake, Sparkles } from 'lucide-react';
import { BRAND_PROMISE } from '@/src/config/site';

export default function CleanEditorialPromise() {
  return (
    <section className="bg-[var(--color-sand,#faf7f2)] py-20 md:py-28 text-[var(--color-ink,#1a2b3c)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
            <Sparkles size={14} />
            Il Nostro Manifesto
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
            {BRAND_PROMISE.editorialManifestoTitle}
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted-fg)] md:text-lg">
            {BRAND_PROMISE.editorialManifestoSubhead}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              01. Zero desk, zero foto da catalogo
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Paghiamo il conto, scattiamo sul posto e testiamo l'accoglienza. Se un posto non ci
              convince, semplicemente non entra nell'Atlante.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <DollarSign size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              02. Scontrini in chiaro e tempi reali
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Ti diciamo quanto si spende in due, quando conviene andare e cosa evitare.
              Informazioni pratiche, non aggettivi entusiasti a vuoto.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <HeartHandshake size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              03. Nessun compromesso sulla verità
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Se una strada è stretta, il parcheggio è difficile o il posto ha dei limiti, lo
              scriviamo chiaro. La fiducia della community viene prima di tutto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
