import { CheckCircle2, DollarSign, HeartHandshake, Sparkles } from 'lucide-react';

export default function CleanEditorialPromise() {
  return (
    <section className="bg-[var(--color-sand,#faf7f2)] py-20 md:py-28 text-[var(--color-ink,#1a2b3c)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
            <Sparkles size={14} />
            Il Nostro Metodo
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
            Trasparenza prima del rumore.
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted-fg)] md:text-lg">
            Siamo una coppia con una regola semplice: consigliare meno posti, ma consigliarli
            meglio.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              01. Ci andiamo di persona
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Prima l'esperienza reale, poi il consiglio. Non pubblichiamo mai foto d'archivio o
              posti consigliati a raggio senza esserci stati.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <DollarSign size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              02. Segniamo ogni dettaglio
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Costi reali in euro, scontrini, tempi di percorrenza e periodo ideale dell'anno. Tutto
              quello che serve per organizzare senza sorprese.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-accent,#c85a32)]">
              <HeartHandshake size={24} />
            </div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              03. Per chi è davvero
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Vi diciamo onestamente per chi è adatto un posto e quali sono i suoi limiti. Se una
              destinazione non vale la pena, vi diciamo no.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
