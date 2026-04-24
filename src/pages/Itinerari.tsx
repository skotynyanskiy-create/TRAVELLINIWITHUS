import { ErrorBoundary } from 'react-error-boundary';
import EditorialArchivePage from '../components/editorial/EditorialArchivePage';
import { SITE_URL } from '../config/site';
import { ITINERARY_GUIDE_CATEGORIES } from '../utils/articleRoutes';

const ITINERARY_PILLARS = [
  {
    title: 'Ritmo prima della lista',
    text: 'Ogni itinerario deve essere leggibile davvero: tappe, tempi e margine reale per viverlo bene.',
  },
  {
    title: 'Weekend e viaggi completi',
    text: 'Distinguiamo mini fughe e itinerari piu estesi, senza mischiare contenuti con densita diverse.',
  },
  {
    title: 'Meno tab aperti',
    text: 'L obiettivo e semplice: uscire dalla pagina con un piano gia solido, non con altri dubbi.',
  },
] as const;

export default function ItinerariPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="py-20 text-center text-[var(--color-accent-text)]">
          Impossibile caricare gli itinerari
        </div>
      }
    >
      <EditorialArchivePage
        section="itinerari"
        eyebrow="Archivio di viaggio"
        title={
          <>
            Itinerari per partire{' '}
            <span className="italic text-black/55">con un piano leggibile</span>
          </>
        }
        description="Questa e la parte piu operativa dell archivio: viaggi completi, weekend strutturati e ritmi testati sul campo. Non una raccolta di tappe a caso, ma piani che puoi davvero usare."
        seoTitle="Itinerari di viaggio"
        seoDescription="Itinerari Travelliniwithus per organizzare weekend e viaggi completi con tempi, tappe e scelte pratiche gia ordinate."
        canonicalPath={`${SITE_URL}/itinerari`}
        breadcrumbLabel="Itinerari"
        browseLabel="Itinerari"
        categoryPrompt="Scegli il formato"
        searchPlaceholder="Cerca un itinerario o una destinazione..."
        resultSingular="itinerario disponibile"
        resultPlural="itinerari disponibili"
        emptyTitle="Nessun itinerario trovato"
        emptyDescription="Prova a cambiare filtro o ricerca. Se il catalogo reale e ancora vuoto, puoi attivare le preview editoriali dal pannello admin per verificare il formato finale."
        previewMessage="Gli itinerari mostrati sono preview controllate: servono a testare struttura, tono e profondita prima della pubblicazione reale."
        cardCta="Leggi l itinerario"
        newsletterSource="itineraries_newsletter"
        heroCardTitle="Come leggerli"
        pillars={ITINERARY_PILLARS}
        categories={ITINERARY_GUIDE_CATEGORIES}
      />
    </ErrorBoundary>
  );
}
