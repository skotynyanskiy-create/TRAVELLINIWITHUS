import { lazy, Suspense } from 'react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TraceSignature = lazy(() => import('../experience/atlante/signature/TraceSignature'));

export default function AtlanteLab() {
  const reduced = useReducedMotion();
  const lowPower = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      {/* Lab interno: momento-firma dell'Atlante. noindex, fuori dal sito pubblico. */}
      <SEO
        title="Atlante — momento firma (lab)"
        description="Anteprima tecnica del momento-firma dell'Atlante Travellini: la traccia luminosa che si disegna."
        canonical={`${SITE_URL}/atlante-lab`}
        noindex
      />
      <style>{`
        html, body, #root, body > div {
          height: 100vh !important; height: 100dvh !important;
          overflow: hidden !important; margin: 0; padding: 0;
        }
        body > div nav, body > div footer, #ai-assistant-bubble, #scroll-progress-bar {
          display: none !important;
        }
        main#main-content { height: 100vh; height: 100dvh; overflow: hidden; background: #0b0805; }
      `}</style>

      <div className="relative h-screen w-full overflow-hidden bg-[#0b0805] text-white select-none">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0b0805]" />}>
          <TraceSignature animate={!reduced} lowPower={lowPower} />
        </Suspense>

        {/* HUD editoriale minimale */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-12">
          <div className="flex items-center justify-between">
            <span className="font-serif text-base tracking-tight">
              Travellini<span className="text-[var(--color-accent)]">with</span>us
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
              anteprima — momento firma
            </span>
          </div>

          <div className="max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-accent)]">
              L&rsquo;Atlante Travellini
            </span>
            <h1 className="mt-3 font-serif text-3xl font-medium leading-[1.12] sm:text-5xl">
              Un reel fa venire voglia.
              <br />
              Una traccia ti aiuta a partire.
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
