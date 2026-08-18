import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Heart,
  Share2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import PostoStamp from '../components/atlante/PostoStamp';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import DealCard from '../components/DealCard';
import PostNavigation from '../components/PostNavigation';
import PostiVicini from '../components/posto/PostiVicini';
import CosaSaperePrima from '../components/posto/CosaSaperePrima';
import PrimaDiAndare from '../components/posto/PrimaDiAndare';
import ReelDelPosto from '../components/posto/ReelDelPosto';
import { Link } from '@/src/components/TransitionLink';
import { PROVENANCE_LABEL, isCertifiedReal, provenanceOf } from '../config/assetProvenance';
import { getContentById } from '../config/contentLibrary';
import { findDestinationByRegionName, getDestinationUrl } from '../config/destinations';
import { SITE_URL } from '../config/site';
import { useFavorites } from '../context/FavoritesContext';
import { trackEvent } from '../services/analytics';
import {
  getUserLocation,
  getGoogleMapsDirectionsUrl,
  calculateHaversineDistance,
  formatGeoDistance,
  type UserLocation,
} from '../utils/geo';
import { buildGoogleMapsListingUrl } from '../utils/placeLinks';
import { shareContent } from '../utils/share';
import { buildReviewJsonLd } from '../lib/placeReviewSchema';

export default function Posto() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getContentById(slug) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  // Sopra il return anticipato: con `item` mancante si renderizzava un hook in
  // meno, e navigando da un posto reale a uno slug inesistente React riusa la
  // stessa fiber → "Rendered fewer hooks than expected".
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  if (!item) {
    return <Navigate to="/esplora" replace />;
  }

  const canonical = `${SITE_URL}/posto/${item.id}`;

  const placeLabel = [item.place.city, item.place.region, item.place.country]
    .filter(Boolean)
    .join(', ');
  // Per un borgo il nome del posto È la città: senza questo controllo la riga
  // «Dove si trova» stampava «Riquewihr — Riquewihr, Francia».
  const placeDetailLabel = [
    item.place.name === item.place.city ? null : item.place.name,
    placeLabel,
  ]
    .filter(Boolean)
    .join(' — ');

  const saved = isFavorite(item.id);
  const coordinates = item.place.coordinates;
  const directionsUrl = coordinates
    ? getGoogleMapsDirectionsUrl({
        lat: coordinates.lat,
        lng: coordinates.lng,
        address: item.place.googlePlaceQuery || `${item.place.name}, ${item.place.city ?? ''}`,
      })
    : '#';
  const mapPinUrl = coordinates ? `/mappa?place=${encodeURIComponent(item.id)}` : undefined;
  const listingUrl = buildGoogleMapsListingUrl({
    name: item.place.name,
    city: item.place.city,
    googlePlaceQuery: item.place.googlePlaceQuery,
  });
  // Un titolo «Orari e contatti» senza ne' orari ne' telefono e' una sezione
  // che promette un servizio che non stiamo offrendo — il gate copre l'intera
  // colonna (eyebrow, righe, bottone distanza, disclaimer), non solo le due
  // righe di testo.
  const hasOrariData = Boolean(item.place.hours || item.place.phone);
  // Due domande diverse del blocco pratico — "cosa devo sapere prima" e "come
  // mi organizzo" — ognuna nel suo componente. La riga «Dati cercati su...»
  // vive sotto l'ultimo dei due che renderizza, mai da sola: se «Prima di
  // andare» c'e' la riga sta li' (anche quando c'e' anche «Cosa sapere
  // prima», che nell'ordine di pagina viene prima); altrimenti tocca a «Cosa
  // sapere prima», se c'e'.
  const haCosaSaperePrima = Boolean(item.practical?.toKnow && item.practical.toKnow.length > 0);
  const haPrimaDiAndare = Boolean(
    item.practical?.gettingThere || item.practical?.duration || item.practical?.when
  );
  const provenienzaSuPrimaDiAndare = haPrimaDiAndare;
  const provenienzaSuCosaSaperePrima = !haPrimaDiAndare && haCosaSaperePrima;
  const distanceKm =
    coordinates && userLocation
      ? calculateHaversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordinates.lat,
          coordinates.lng
        )
      : null;

  const handleDirectionsClick = () => {
    trackEvent('place_directions_click', {
      place_id: item.id,
      has_coordinates: Boolean(coordinates),
    });
  };

  const handleListingClick = () => {
    trackEvent('place_google_listing_click', { place_id: item.id });
  };

  const handlePhoneClick = () => {
    trackEvent('place_phone_click', { place_id: item.id });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
    if (!saved) {
      trackEvent('place_favorite_add', { place_id: item.id, source: 'posto' });
    }
  };

  const handleDetectLocation = async () => {
    try {
      const loc = await getUserLocation();
      setUserLocation(loc);
    } catch {
      // Ignorato se l'utente rifiuta i permessi
    }
  };

  const handleShare = async () => {
    trackEvent('place_share_click', {
      place_id: item.id,
      method:
        typeof navigator !== 'undefined' && typeof navigator.share === 'function'
          ? 'native'
          : 'copy',
    });

    const success = await shareContent({
      title: item.title,
      text: item.description || item.hook,
      url: canonical,
    });

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Link alla pagina destinazione della regione/paese — solo se il nodo esiste
  // nell'albero destinations (regioni italiane + paesi). Altrimenti testo semplice.
  const destNode =
    findDestinationByRegionName(item.place.region ?? '') ??
    findDestinationByRegionName(item.place.country ?? '');
  const destUrl = destNode ? getDestinationUrl(destNode) : undefined;

  // `Review`, non `Restaurant`: questa pagina descrive l'attività, non è
  // l'attività. Il corpo è `item.description`, cioè il testo di Rodrigo &
  // Betta su cos'è il posto: da quando i verdetti sono stati tolti
  // (2026-08-15) non c'è più un `summary` da preferirgli. Resta un
  // `reviewBody` onesto — schema.org non richiede un voto, e qui non ce n'è
  // mai stato uno.
  const placeJsonLd = item.description ? buildReviewJsonLd(item, item.description) : undefined;

  return (
    <PageLayout>
      <SEO
        title={`${item.hook} — ${item.title}`}
        description={item.description}
        canonical={canonical}
        // Card 1200x630 di generate-og-images.mjs, non `item.cover` (frame reel
        // 9:16 e path relativo: gli unfurl vogliono un URL assoluto). I
        // placeholder non hanno card generata e ricadono sul default.
        image={item.isPlaceholder ? undefined : `${SITE_URL}/og/posto-${item.id}.jpg`}
        // Pass di onestà: i posti placeholder restano visibili ma NON indicizzati
        // (evita thin-content su ~40 pagine finte). Reversibile: quando l'import
        // Instagram porta il dato reale (isPlaceholder:false) tornano indicizzabili.
        noindex={item.isPlaceholder}
        jsonLd={placeJsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Esplora', url: '/esplora' },
          ...(destNode && destUrl ? [{ name: destNode.name, url: destUrl }] : []),
          { name: item.title, url: `/posto/${item.id}` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <Breadcrumbs
          schema={false}
          items={[
            { label: 'Esplora', href: '/esplora' },
            ...(destNode && destUrl ? [{ label: destNode.name, href: destUrl }] : []),
            { label: item.title },
          ]}
        />

        {/* La carta del posto — fronte "Sembra inventato", retro "Esiste davvero" */}
        <PostoStamp item={item} />

        {/* Da dove viene l'immagine. Il sito chiede fiducia sulla foto ancora
            prima che sul testo: dirlo in una riga costa nulla e vale piu' di un
            aggettivo. Compare solo quando la provenienza e' certificata — un
            asset "da certificare" o generato non si etichetta come prova
            (DECISION_IMAGERY_TRUTH_RULE_2026-07-22). */}
        {isCertifiedReal(item.cover) && (
          <p className="mt-3 text-center font-serif text-xs italic text-[var(--color-muted-fg)]">
            {PROVENANCE_LABEL[provenanceOf(item.cover)!]}
          </p>
        )}

        {/* Corpo editoriale */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            {/* h1 = hook */}
            <h1 className="font-serif text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
              {item.hook}
            </h1>

            {/* Luogo: il link alla destinazione, o il testo semplice se il nodo
                non esiste nell'albero. Qui sopra c'era l'etichetta di verdetto,
                tolta il 2026-08-15 con tutto il resto del giudizio. */}
            <div className="mt-4 flex items-center gap-4">
              <div className="min-w-0">
                {destUrl ? (
                  <Link
                    to={destUrl}
                    className="mt-1 inline-flex items-center gap-2 rounded py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)] underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <MapPin size={14} /> {placeLabel}
                  </Link>
                ) : (
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
                    <MapPin size={14} /> {placeLabel}
                  </p>
                )}
              </div>
            </div>

            {/* Riga Salva / Condividi — leggera, fuori dalla card Info pratiche */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-ink-2)]">
                Salvalo, o mandalo a chi ci deve venire.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-pressed={saved}
                  aria-label={saved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
                  className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:flex-none ${
                    saved
                      ? 'bg-[var(--color-accent)] text-[var(--color-ink)]'
                      : 'border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  <Heart size={14} className={saved ? 'fill-current' : ''} aria-hidden />
                  {saved ? 'Salvato per il viaggio' : 'Salva per il viaggio'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Condividi questo posto"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:flex-none"
                >
                  {copied ? (
                    <CheckCircle size={14} aria-hidden />
                  ) : (
                    <Share2 size={14} aria-hidden />
                  )}
                  {copied ? 'Link copiato' : 'Condividi'}
                </button>
              </div>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Link copiato negli appunti' : ''}
              </span>
            </div>

            {/* Card "Info pratiche" — Dove [+ Orari e contatti solo se esistono].
                La colonna Orari appare SOLO con almeno un dato reale (hours o
                phone): senza gate un titolo «Orari e contatti» sopra il nulla
                fa sembrare la scheda incompleta invece che essenziale. Con la
                colonna assente la card torna a una sola colonna, senza
                divisorio orfano. */}
            <section
              aria-label="Info pratiche"
              className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8"
            >
              <div className={hasOrariData ? 'grid gap-6 md:grid-cols-2 md:gap-8' : ''}>
                {/* DOVE */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Dove si trova
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-sm text-[var(--color-ink-2)]">
                    <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                    {placeDetailLabel}
                  </p>
                  {/* Senza coordinate `directionsUrl` vale '#': il bottone
                      restava, e portava da nessuna parte. Finora non era mai
                      successo perché tutte le schede reali erano geocodificate,
                      ma la churrería di Madrid non esiste su OpenStreetMap e
                      darle un pin inventato sarebbe stato peggio. Se non
                      sappiamo dov'è con precisione, non promettiamo di
                      accompagnarci nessuno. */}
                  {coordinates && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleDirectionsClick}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:w-auto"
                    >
                      <Navigation size={14} aria-hidden /> Indicazioni
                    </a>
                  )}
                  {mapPinUrl && (
                    <Link
                      to={mapPinUrl}
                      className="mt-3 inline-flex items-center gap-1.5 py-1.5 text-sm text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      <MapPin size={14} aria-hidden /> Vedi sulla mappa
                    </Link>
                  )}
                  {/* Sostituisce l'ex `PlaceBusinessActions` (variant="full"):
                      quel blocco duplicava "Indicazioni" e "Condividi" con un
                      secondo fascio di bottoni identici. Resta un solo link
                      quieto verso la scheda Google, sempre disponibile — non
                      dipende da hours/phone perché la ricerca Google funziona
                      solo con nome + città. */}
                  <a
                    href={listingUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleListingClick}
                    className="mt-3 inline-flex items-center gap-1.5 py-1.5 text-sm text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <ExternalLink size={14} aria-hidden /> Orari e contatti su Google
                  </a>
                </div>

                {/* ORARI E CONTATTI — solo con almeno un dato reale */}
                {hasOrariData && (
                  <div className="border-t border-[var(--color-border)] pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                      <Clock size={13} aria-hidden /> Orari e contatti
                    </p>

                    <div className="mt-3 space-y-2.5">
                      {item.place.hours && (
                        <p className="flex items-center gap-2 text-sm text-[var(--color-ink-2)]">
                          <Clock size={14} className="shrink-0" aria-hidden /> {item.place.hours}
                        </p>
                      )}
                      {item.place.phone && (
                        <a
                          href={`tel:${item.place.phone.replace(/\s+/g, '')}`}
                          onClick={handlePhoneClick}
                          className="flex items-center gap-2 py-1.5 text-sm text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                        >
                          <Phone size={14} className="shrink-0" aria-hidden /> Chiama ·{' '}
                          {item.place.phone}
                        </a>
                      )}
                    </div>

                    {userLocation && distanceKm !== null ? (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-ink-2)]">
                        <Navigation size={13} aria-hidden /> Sei a {formatGeoDistance(distanceKm)}
                      </p>
                    ) : (
                      !userLocation && (
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          className="mt-3 inline-flex items-center gap-1.5 py-2 text-xs text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent-text)] hover:underline"
                        >
                          <Navigation size={13} aria-hidden /> Calcola quanto dista da me
                        </button>
                      )
                    )}

                    <p className="mt-4 text-[11px] text-[var(--color-muted-fg)]">
                      Orari, telefono e prenotazione sono aggiornati direttamente da Google.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Descrizione */}
            {item.description && (
              <p className="mt-8 text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
                {item.description}
              </p>
            )}

            {/* Cosa sapere prima — i limiti scritti da Rodrigo e Betta:
                chiusure, prenotazione obbligatoria, omonimie. Subito dopo la
                descrizione perche' e' l'informazione che puo' far cambiare
                programma a chi legge. */}
            <CosaSaperePrima item={item} mostraProvenienza={provenienzaSuCosaSaperePrima} />

            {/* Le informazioni per organizzarsi: come ci arrivi, quanto ci
                stai, quando andarci. */}
            <PrimaDiAndare item={item} mostraProvenienza={provenienzaSuPrimaDiAndare} />

            {/* Il reel girato qui — la prova in movimento, prima solo su IG.
                Il link verso Instagram vive dentro il componente stesso (sotto
                la copertina): qui sopra restava una terza pill identica per
                funzione a "Indicazioni", la stessa azione ripetuta due volte. */}
            <ReelDelPosto
              postoId={item.id}
              luogo={item.place.city ?? item.place.region ?? item.place.country}
            />
          </div>

          {/* Colonna destra — valore + offerta, solo se c'è almeno un dato reale.
              Qui sotto «Vale la pena?» c'era di nuovo `item.description`, la
              stessa identica riga gia' stampata come paragrafo poco sopra: su
              tutte e 29 le schede il visitatore leggeva due volte lo stesso
              testo, la seconda sotto un titolo che promette un verdetto e
              consegna una descrizione. */}
          {(item.value?.price || item.deal) && (
            <div className="w-full shrink-0 space-y-6 md:w-64">
              {item.value?.price && (
                <aside className="w-full rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] p-6">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Prezzo indicativo
                  </p>
                  <p className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                    {item.value.price}
                  </p>
                  {item.value.budget && (
                    <p className="mt-1 text-[11px] text-[var(--color-muted-fg)]">
                      Budget: {item.value.budget}
                    </p>
                  )}
                </aside>
              )}
              <DealCard deal={item.deal} />
            </div>
          )}
        </div>

        {/* Cosa c'è a poca strada — la domanda che ci si fa arrivando qui */}
        <PostiVicini posto={item} />

        {/* Navigazione prev/next tra posti */}
        <PostNavigation currentId={item.id} />

        {/* Strip newsletter */}
        <div className="mt-20">
          <Newsletter
            variant="compact"
            source={`posto_${item.id}`}
            title="Ricevi i prossimi posti da salvare."
            stacked
          />
        </div>
      </div>
    </PageLayout>
  );
}
