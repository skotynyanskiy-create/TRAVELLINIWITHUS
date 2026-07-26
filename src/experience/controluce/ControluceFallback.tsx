import { ACTS } from './acts';

/** Static readable sequence: reduced-motion / small screens. */
export default function ControluceFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-sand)] px-6 py-24">
      <div className="mx-auto max-w-2xl space-y-24">
        {ACTS.map((act) => (
          <section key={act.id} className="text-center">
            <h2 className="font-serif italic text-5xl text-[var(--color-ink)]">{act.title}</h2>
            <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--color-ink)]/85">
              {act.verse}
            </p>
            <img
              src={act.reel.cover}
              alt={act.reel.alt}
              loading="lazy"
              className="mx-auto mt-8 w-64 rounded-sm"
            />
            <span className="mt-3 block font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink)]/50">
              {act.reel.location}
            </span>
          </section>
        ))}
        <p className="text-center font-serif italic text-[var(--color-ink)]/70">
          Rodrigo &amp; Betta
        </p>
      </div>
    </div>
  );
}
