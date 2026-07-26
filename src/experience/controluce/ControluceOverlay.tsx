import { useEffect, useRef, type MutableRefObject } from 'react';
import { ACTS } from './acts';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 outside [a,b], ramps in/out inside. */
const window01 = (t: number, a: number, b: number, ramp = 0.03) =>
  t < a || t > b ? 0 : clamp01(Math.min((t - a) / ramp, (b - t) / ramp, 1));

const WINDOW_CLIP: Record<string, string> = {
  oblo: 'ellipse(50% 50% at 50% 50%)',
  vetrata: 'polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%)',
  shoji: 'inset(8% 0 8% 0)',
  sfrangiato: 'polygon(3% 6%, 97% 2%, 99% 94%, 5% 98%)',
  portone: 'inset(0 12% 0 12% round 45% 45% 0 0)',
};

export default function ControluceOverlay({ tRef }: { tRef: MutableRefObject<number> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const t = tRef.current;
      const root = rootRef.current;
      if (root) {
        if (t > 0.005) scrolledRef.current = true;
        const cue = root.querySelector<HTMLElement>('[data-cue]');
        if (cue) cue.style.visibility = scrolledRef.current ? 'hidden' : 'visible';
        ACTS.forEach((act, i) => {
          const [a, b] = act.window;
          const verse = root.querySelector<HTMLElement>(`[data-act="${i}"]`);
          if (verse) {
            const v = window01(t, a + (b - a) * 0.18, b - (b - a) * 0.18, 0.04);
            verse.style.opacity = String(v);
            verse.style.transform = `translateY(${(1 - v) * 14}px)`;
          }
          const win = root.querySelector<HTMLElement>(`[data-reel-window="${i}"]`);
          if (win)
            win.style.opacity = String(
              window01(t, act.reel.show[0], act.reel.show[1], 0.025) * 0.9
            );
        });
        const end = root.querySelector<HTMLElement>('[data-act-end]');
        if (end) {
          const v = window01(t, 0.93, 1.08, 0.04);
          end.style.opacity = String(v);
          end.style.visibility = v > 0.05 ? 'visible' : 'hidden';
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tRef]);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-10">
      {ACTS.map((act, i) => (
        <div
          key={act.id}
          data-act={i}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center opacity-0"
        >
          <h2 className="font-serif italic text-[clamp(3.5rem,9vw,8rem)] leading-none text-[var(--color-ink)] mix-blend-multiply">
            {act.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-relaxed text-[var(--color-ink)]/85">
            {act.verse}
          </p>
        </div>
      ))}

      {ACTS.map((act, i) => (
        <div
          key={`w-${act.id}`}
          data-reel-window={i}
          aria-hidden="true"
          className="absolute opacity-0"
          style={{
            width: act.reel.shape === 'shoji' ? 320 : 240,
            left: i % 2 === 0 ? '12%' : 'auto',
            right: i % 2 === 1 ? '12%' : 'auto',
            top: `${30 + (i % 3) * 18}%`,
          }}
        >
          <img
            src={act.reel.cover}
            alt=""
            loading="lazy"
            className="h-auto w-full"
            style={{
              clipPath: WINDOW_CLIP[act.reel.shape],
              filter: 'saturate(0.9) contrast(0.95)',
            }}
          />
          <span className="mt-2 block text-center font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink)]/50">
            {act.reel.location}
          </span>
        </div>
      ))}

      <div
        data-cue
        className="absolute bottom-8 inset-x-0 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink)]/55 animate-pulse"
      >
        scorri — la luce la muovi tu
      </div>

      {/* Chiusura Atto V (spec par.4): firma + unica uscita dalla pagina. */}
      <div
        data-act-end
        className="pointer-events-auto absolute bottom-16 inset-x-0 text-center opacity-0"
      >
        <p className="font-serif italic text-[var(--color-ink)]/70">Rodrigo &amp; Betta</p>
        <a
          href="/esplora"
          className="mt-4 inline-block font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Esplora l&apos;atlante →
        </a>
      </div>
    </div>
  );
}
