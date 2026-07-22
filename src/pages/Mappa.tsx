import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import type { MapContentSummary } from '../components/map/MapboxWorldMap';
import './Mappa.css';

const MapboxWorldMap = lazy(() => import('../components/map/MapboxWorldMap'));

const INITIAL_SUMMARY: MapContentSummary = {
  loading: true,
  hasError: false,
  mode: 'loading',
  realCount: 0,
  previewCount: 0,
  filteredCount: 0,
};

function MapShellFallback() {
  return (
    <div className="map-traces-skeleton" aria-busy="true" aria-live="polite">
      <div className="map-traces-skeleton__filters" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="map-traces-skeleton__canvas">
        <span className="map-traces-spinner" aria-hidden="true" />
        <p>Tracciamo i nostri passi…</p>
        <span className="sr-only">La mappa si sta caricando.</span>
      </div>
    </div>
  );
}

function SummaryCopy({ summary }: { summary: MapContentSummary }) {
  if (summary.loading) {
    return <span>La mappa si sta caricando.</span>;
  }

  if (summary.hasError) {
    return <span>La mappa non si è caricata.</span>;
  }

  if (summary.filteredCount === 0) {
    return <span>Nessuna traccia con questi filtri.</span>;
  }

  if (summary.mode === 'demo') {
    return (
      <span>
        {summary.previewCount}{' '}
        {summary.previewCount === 1
          ? 'anteprima editoriale sulla mappa'
          : 'anteprime editoriali sulla mappa'}
      </span>
    );
  }

  return (
    <>
      <span>
        {summary.realCount}{' '}
        {summary.realCount === 1 ? 'destinazione esplorata' : 'destinazioni esplorate'}
      </span>
      {summary.mode === 'mixed' && (
        <>
          <strong>Include anteprime editoriali</strong>
          <small>
            Le anteprime mostrano contenuti in preparazione e non indicano luoghi visitati o
            esperienze provate da noi.
          </small>
        </>
      )}
    </>
  );
}

export default function Mappa() {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [summary, setSummary] = useState<MapContentSummary>(INITIAL_SUMMARY);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldLoadMap(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="map-journal-page">
      <SEO
        title="Mappa delle destinazioni"
        description="Esplora la mappa di Travelliniwithus: filtra destinazioni e contenuti per continente o esperienza, poi apri guide, reel e itinerari di Rodrigo e Betta."
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Mappa', url: `${SITE_URL}/mappa` },
        ]}
      />

      <header className="map-journal-intro">
        <p className="map-journal-kicker">Taccuino di viaggio · Mappa delle tracce</p>
        <h1>Scegli un posto partendo dalla mappa.</h1>
        <p className="map-journal-deck">
          Parti da un continente o da un tipo di esperienza: ogni pin apre il contenuto disponibile
          per quel luogo.
        </p>
        <p className="map-journal-summary" role="status" aria-live="polite" aria-atomic="true">
          <SummaryCopy summary={summary} />
        </p>
      </header>

      {shouldLoadMap ? (
        <Suspense fallback={<MapShellFallback />}>
          <MapboxWorldMap onSummaryChange={setSummary} />
        </Suspense>
      ) : (
        <MapShellFallback />
      )}
    </div>
  );
}
