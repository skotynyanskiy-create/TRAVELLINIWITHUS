import { ErrorBoundary } from 'react-error-boundary';
import EditorialArchivePage from '../components/editorial/EditorialArchivePage';
import { SITE_URL } from '../config/site';
import { GUIDE_LIBRARY_CATEGORIES } from '../utils/articleRoutes';

const GUIDE_PILLARS = [
  {
    title: 'Prima di prenotare',
    text: 'Checklist, periodi migliori, budget e scelte pratiche prima di bloccare un viaggio.',
  },
  {
    title: 'Durante l organizzazione',
    text: 'Mappe, timing, alloggi e dettagli che evitano errori banali e tempo perso.',
  },
  {
    title: 'Dopo la prima idea',
    text: 'Risorse e collegamenti utili per trasformare un interesse generico in una decisione solida.',
  },
] as const;

export default function GuidePage() {
  return (
    <ErrorBoundary
      fallback={<div className="py-20 text-center text-red-500">Impossibile caricare le guide</div>}
    >
      <EditorialArchivePage
        section="guide"
        eyebrow="Biblioteca pratica"
        title={
          <>
            Guide per partire <span className="italic text-black/55">con piu criterio</span>
          </>
        }
        description="Qui trovi il layer pratico del sito: consigli, budget, food guide, dove dormire e pianificazione. Meno rumore ispirazionale, piu scelte che reggono davvero quando devi organizzare."
        seoTitle="Guide pratiche di viaggio"
        seoDescription="Guide Travelliniwithus per scegliere meglio dove andare, cosa salvare e come organizzare viaggi utili, belli e credibili."
        canonicalPath={`${SITE_URL}/guide`}
        breadcrumbLabel="Guide"
        browseLabel="Guide"
        categoryPrompt="Scegli un argomento"
        searchPlaceholder="Cerca per tema o luogo..."
        resultSingular="guida disponibile"
        resultPlural="guide disponibili"
        emptyTitle="Nessuna guida trovata"
        emptyDescription="Prova a cambiare filtro o ricerca. Se il catalogo reale e ancora vuoto, puoi attivare le preview editoriali dal pannello admin per vedere la struttura finale."
        previewMessage="Le guide mostrate sono preview controllate: servono a vedere ritmo, formato e qualita finale. Prima del deploy pubblico vanno approvate, completate o sostituite con contenuti reali."
        cardCta="Leggi la guida"
        newsletterSource="guides_newsletter"
        heroCardTitle="Come usarle"
        pillars={GUIDE_PILLARS}
        categories={GUIDE_LIBRARY_CATEGORIES}
      />
    </ErrorBoundary>
  );
}
