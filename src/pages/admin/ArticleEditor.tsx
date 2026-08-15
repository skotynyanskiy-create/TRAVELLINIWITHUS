import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import FormSkeleton from '../../components/FormSkeleton';
import { verifyWithSearch, verifyWithMaps } from '../../services/aiVerificationService';
import {
  Search,
  MapPin,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Undo2,
  X,
  Clock,
  FileText,
  CircleCheck,
  History,
} from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEOPreview from '../../components/SEOPreview';
import MarkdownArticleEditor from '../../components/admin/MarkdownArticleEditor';

/** Esito del caricamento di un articolo esistente: i due casi hanno un
 * rimedio diverso (id sbagliato nell'indirizzo vs. rete/permessi), quindi
 * il messaggio in pagina li distingue invece di limitarsi a un errore generico. */
type LoadError = 'not-found' | 'network' | null;

interface VerifyMessage {
  type: 'success' | 'error';
  text: string;
}

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

/** Tutti i campi che un autore può perdere chiudendo la scheda per sbaglio:
 * usati sia per la bozza locale (bug #5) sia per il confronto "modifiche non
 * salvate" (bug #4 e #6). */
interface ArticleFormSnapshot {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  location: string;
  country: string;
  region: string;
  city: string;
  continent: string;
  experienceTypes: string;
  period: string;
  budget: string;
  readTime: string;
  tips: string;
  packingList: string;
  highlights: string;
  mapUrl: string;
  duration: string;
  videoUrl: string;
  published: boolean;
}

/** Sopra i 10s un `setDoc` in sospeso è quasi certamente offline (Firestore
 * senza cache persistente non rifiuta mai la promise): oltre questa soglia si
 * smette di dire "sto salvando" e si dice la verità (bug #3). */
const SAVE_TIMEOUT_MS = 10000;
/** Attesa dall'ultima digitazione prima di scrivere la bozza locale (bug #5). */
const DRAFT_DEBOUNCE_MS = 2000;

interface StoredDraft {
  savedAt: number;
  snapshot: ArticleFormSnapshot;
}

function readStoredDraft(key: string): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as { savedAt?: unknown }).savedAt === 'number' &&
      typeof (parsed as { snapshot?: unknown }).snapshot === 'object'
    ) {
      return parsed as StoredDraft;
    }
    return null;
  } catch {
    return null;
  }
}

function toDateSafe(value: unknown): Date | null {
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

const formatDraftTimestamp = (epochMs: number) => {
  const date = new Date(epochMs);
  const weekday = date.toLocaleDateString('it-IT', { weekday: 'long' });
  return `${weekday} alle ${formatTime(date)}`;
};

type BannerTone = 'success' | 'error' | 'warning' | 'info';

const BANNER_TONE_CLASSES: Record<BannerTone, string> = {
  success:
    'border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]',
  error:
    'border-[var(--color-error)]/30 bg-[var(--color-error-soft)] text-[var(--color-error-text)]',
  warning:
    'border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]',
  info: 'border-[var(--color-info)]/30 bg-[var(--color-info-soft)] text-[var(--color-info-text)]',
};

/** Un solo banner condiviso in pagina: la Verifica AI lo introduceva già in
 * forma inline (commit a601da8) — qui diventa comune invece di ripetersi per
 * ognuno dei nuovi avvisi (slug duplicato, salvataggio fallito, timeout,
 * bozza locale, conferma di uscita). */
function MessageBanner({
  tone,
  onDismiss,
  children,
}: {
  tone: BannerTone;
  onDismiss?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-lg border p-3 text-sm ${BANNER_TONE_CLASSES[tone]}`}
    >
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Chiudi messaggio"
          className="opacity-70 hover:opacity-100 shrink-0"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [continent, setContinent] = useState('');
  const [experienceTypes, setExperienceTypes] = useState('');
  const [period, setPeriod] = useState('');
  const [budget, setBudget] = useState('');
  const [readTime, setReadTime] = useState('');
  const [tips, setTips] = useState('');
  const [packingList, setPackingList] = useState('');
  const [highlights, setHighlights] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);
  const [loadError, setLoadError] = useState<LoadError>(null);
  const [saving, setSaving] = useState(false);

  const [isVerifyingSearch, setIsVerifyingSearch] = useState(false);
  const [isVerifyingMaps, setIsVerifyingMaps] = useState(false);
  const [previousContent, setPreviousContent] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<VerifyMessage | null>(null);

  const [issues, setIssues] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveTimedOut, setSaveTimedOut] = useState(false);
  const [slugConflict, setSlugConflict] = useState<{ slug: string; suggestion: string } | null>(
    null
  );
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [draftRecovery, setDraftRecovery] = useState<StoredDraft | null>(null);

  const draftKey = `twu:draft:articolo:${id ?? 'nuovo'}`;
  /* Stringa, non l'oggetto: confrontare due JSON.stringify e' piu' cheap e
     piu' sicuro come dipendenza di effetto rispetto a un oggetto ricreato a
     ogni render. */
  const baselineRef = useRef<string | null>(null);
  const recoveryCheckedRef = useRef(false);

  const buildSnapshot = (): ArticleFormSnapshot => ({
    title,
    slug,
    excerpt,
    content,
    coverImage,
    category,
    author,
    location,
    country,
    region,
    city,
    continent,
    experienceTypes,
    period,
    budget,
    readTime,
    tips,
    packingList,
    highlights,
    mapUrl,
    duration,
    videoUrl,
    published,
  });

  const applySnapshot = (snapshot: ArticleFormSnapshot) => {
    setTitle(snapshot.title);
    setSlug(snapshot.slug);
    setExcerpt(snapshot.excerpt);
    setContent(snapshot.content);
    setCoverImage(snapshot.coverImage);
    setCategory(snapshot.category);
    setAuthor(snapshot.author);
    setLocation(snapshot.location);
    setCountry(snapshot.country);
    setRegion(snapshot.region);
    setCity(snapshot.city);
    setContinent(snapshot.continent);
    setExperienceTypes(snapshot.experienceTypes);
    setPeriod(snapshot.period);
    setBudget(snapshot.budget);
    setReadTime(snapshot.readTime);
    setTips(snapshot.tips);
    setPackingList(snapshot.packingList);
    setHighlights(snapshot.highlights);
    setMapUrl(snapshot.mapUrl);
    setDuration(snapshot.duration);
    setVideoUrl(snapshot.videoUrl);
    setPublished(snapshot.published);
  };

  const currentSnapshot = buildSnapshot();
  const currentSnapshotKey = JSON.stringify(currentSnapshot);
  const dirty = baselineRef.current !== null && currentSnapshotKey !== baselineRef.current;

  /* Baseline per "modifiche non salvate": ai valori correnti per un articolo
     nuovo (appena montato), oppure ai valori appena caricati da Firestore.
     Deliberatamente NON dipende da currentSnapshotKey: se lo facesse, la
     baseline inseguirebbe ogni digitazione e "dirty" sarebbe sempre falso. */
  useEffect(() => {
    if (!id || (!loading && !loadError)) {
      baselineRef.current = currentSnapshotKey;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadError]);

  /* Controllo una tantum, dopo che la baseline sopra si e' assestata nello
     stesso commit: una bozza locale diversa dalla baseline e' per forza
     rimasta li' da una sessione precedente mai salvata (bug #5). */
  useEffect(() => {
    if (recoveryCheckedRef.current) return;
    if (id && (loading || loadError)) return;
    recoveryCheckedRef.current = true;
    const stored = readStoredDraft(draftKey);
    if (!stored) return;
    if (JSON.stringify(stored.snapshot) === baselineRef.current) return;
    setDraftRecovery(stored);
  }, [id, loading, loadError, draftKey]);

  /* Bozza locale debounced: 2s dall'ultimo cambiamento di contenuto reale
     (currentSnapshotKey), non da ogni render (bug #5). */
  useEffect(() => {
    if (loading || loadError) return;
    const timeoutId = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          draftKey,
          JSON.stringify({ savedAt: Date.now(), snapshot: currentSnapshot })
        );
      } catch {
        // storage pieno o non disponibile: la bozza locale e' un extra, non deve rompere l'editor
      }
    }, DRAFT_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnapshotKey, loading, loadError, draftKey]);

  /* Avviso nativo del browser: chiudere la scheda o l'URL bar con modifiche
     pendenti o un salvataggio ancora in corso non deve essere silenzioso
     (bug #3 e #4). */
  useEffect(() => {
    if (!dirty && !saving) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty, saving]);

  const handleApplyDraft = () => {
    if (!draftRecovery) return;
    applySnapshot(draftRecovery.snapshot);
    setDraftRecovery(null);
  };

  const handleDiscardDraft = () => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // vedi sopra: la bozza locale e' un extra
    }
    setDraftRecovery(null);
  };

  const handleCancelClick = () => {
    if (dirty) {
      setConfirmDiscard(true);
      return;
    }
    navigate('/admin');
  };

  const handleConfirmDiscard = () => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // vedi sopra
    }
    navigate('/admin');
  };

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setLoadError('not-found');
        return;
      }
      const data = docSnap.data();
      const updatedAtDate = toDateSafe(data.updatedAt);
      if (updatedAtDate) setLastSavedAt(updatedAtDate);
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setExcerpt(data.excerpt || '');
      setContent(data.content || '');
      setCoverImage(data.coverImage || '');
      setCategory(data.category || '');
      setAuthor(data.author || '');
      setLocation(data.location || '');
      setCountry(data.country || '');
      setRegion(data.region || '');
      setCity(data.city || '');
      setContinent(data.continent || '');
      setExperienceTypes(
        Array.isArray(data.experienceTypes) ? data.experienceTypes.join('\n') : ''
      );
      setPeriod(data.period || '');
      setBudget(data.budget || '');
      setReadTime(data.readTime || '');
      setTips(Array.isArray(data.tips) ? data.tips.join('\n') : '');
      setPackingList(Array.isArray(data.packingList) ? data.packingList.join('\n') : '');
      setHighlights(Array.isArray(data.highlights) ? data.highlights.join('\n') : '');
      setMapUrl(data.mapUrl || '');
      setDuration(data.duration || '');
      setVideoUrl(data.videoUrl || '');
      setPublished(data.published || false);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.GET, `articles/${id}`);
      } catch {
        // handleFirestoreError rilancia sempre per contratto: qui interessa solo
        // il logging/telemetria che fa prima di rilanciare, non la propagazione.
      }
      setLoadError('network');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id, fetchArticle]);

  const handleVerifySearch = async () => {
    if (!content) return;
    setIsVerifyingSearch(true);
    setVerifyMessage(null);
    const contentBeforeVerify = content;
    try {
      const verifiedContent = await verifyWithSearch(content, title);
      setPreviousContent(contentBeforeVerify);
      setContent(verifiedContent);
      setVerifyMessage({
        type: 'success',
        text: 'Verifica dei fatti completata. Controlla i blocchi editoriali (:::posto, :::dati…) prima di salvare: il modello può averli modificati.',
      });
    } catch (error) {
      console.error('Errore durante la verifica con Search:', error);
      setVerifyMessage({
        type: 'error',
        text: 'Si è verificato un errore durante la verifica dei fatti. Il contenuto non è stato modificato.',
      });
    } finally {
      setIsVerifyingSearch(false);
    }
  };

  const handleVerifyMaps = async () => {
    if (!content) return;
    setIsVerifyingMaps(true);
    setVerifyMessage(null);
    const contentBeforeVerify = content;
    try {
      const verifiedContent = await verifyWithMaps(content, title);
      setPreviousContent(contentBeforeVerify);
      setContent(verifiedContent);
      setVerifyMessage({
        type: 'success',
        text: 'Verifica geografica completata. Controlla i blocchi editoriali (:::posto, :::mappa…) prima di salvare: il modello può averli modificati.',
      });
    } catch (error) {
      console.error('Errore durante la verifica con Maps:', error);
      setVerifyMessage({
        type: 'error',
        text: 'Si è verificato un errore durante la verifica geografica. Il contenuto non è stato modificato.',
      });
    } finally {
      setIsVerifyingMaps(false);
    }
  };

  const handleUndoVerify = () => {
    if (previousContent === null) return;
    setContent(previousContent);
    setPreviousContent(null);
    setVerifyMessage({
      type: 'success',
      text: 'Ripristinata la versione precedente del contenuto.',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaveError(null);
    setSlugConflict(null);
    setSaveTimedOut(false);

    // Bug #6: gli errori di sintassi bloccano la pubblicazione, mai il
    // salvataggio come bozza — mettere via un lavoro a meta' e' normale,
    // pubblicarlo rotto no.
    if (published && issues.length > 0) {
      setSaveError(
        `Non puoi pubblicare: ci sono ancora ${
          issues.length === 1 ? '1 cosa da correggere' : `${issues.length} cose da correggere`
        } nel contenuto. Correggi i blocchi editoriali, oppure disattiva "Pubblica immediatamente" per salvare come bozza.`
      );
      return;
    }

    const articleId = id || slug || Date.now().toString();
    const docRef = doc(db, 'articles', articleId);

    setSaving(true);

    // Bug #1: in creazione l'id del documento e' lo slug — senza questo
    // controllo, uno slug gia' in uso sovrascrive l'articolo esistente senza
    // avviso e senza possibilita' di recupero. Solo in creazione: in modifica
    // il comportamento resta invariato.
    if (!id) {
      try {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          setSlugConflict({ slug, suggestion: `${slug}-2` });
          setSaving(false);
          return;
        }
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.GET, `articles/${articleId}`);
        } catch {
          // handleFirestoreError rilancia sempre per contratto: qui interessa solo il logging
        }
        setSaveError(
          'Non è stato possibile verificare se lo slug è già in uso. Controlla la connessione e riprova.'
        );
        setSaving(false);
        return;
      }
    }

    const articleData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author,
      location,
      country,
      region,
      city,
      continent,
      experienceTypes: splitLines(experienceTypes),
      period,
      budget,
      readTime,
      tips: splitLines(tips),
      packingList: splitLines(packingList),
      highlights: splitLines(highlights),
      mapUrl,
      duration: duration || null,
      videoUrl: videoUrl || null,
      published,
      authorId: user.uid,
      updatedAt: serverTimestamp(),
      ...(id ? {} : { createdAt: serverTimestamp() }),
    };

    // Bug #3: senza cache persistente configurata, offline il setDoc non si
    // rifiuta mai — resta pendente. Oltre SAVE_TIMEOUT_MS si smette di dire
    // "sto salvando" e si dice la verita', senza pero' smettere di aspettare
    // (una seconda scrittura concorrente sarebbe peggio).
    const timeoutId = window.setTimeout(() => setSaveTimedOut(true), SAVE_TIMEOUT_MS);

    try {
      await setDoc(docRef, articleData, { merge: true });
      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        // storage non disponibile: non deve bloccare un salvataggio riuscito
      }
      navigate('/admin');
    } catch (error) {
      // Bug #2: handleFirestoreError rilancia sempre e nessuno ascoltava il
      // CustomEvent che emette — l'utente vedeva solo il bottone tornare a
      // "Salva" senza alcun messaggio. Ora l'errore compare in pagina.
      try {
        handleFirestoreError(error, OperationType.WRITE, `articles/${articleId}`);
      } catch {
        // handleFirestoreError rilancia sempre per contratto: qui interessa solo il logging
      }
      setSaveError(
        'Salvataggio non riuscito. Controlla la connessione e riprova: il testo non è andato perso, è ancora qui.'
      );
    } finally {
      window.clearTimeout(timeoutId);
      setSaving(false);
      setSaveTimedOut(false);
    }
  };

  if (loading) return <FormSkeleton />;

  if (loadError) {
    return (
      <PageLayout>
        <Section className="pt-32 pb-24 max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle size={32} className="text-[var(--color-error-text)]" />
          <h1 className="text-3xl font-serif">
            {loadError === 'not-found' ? 'Articolo non trovato' : "Impossibile caricare l'articolo"}
          </h1>
          <p className="text-[var(--color-muted-fg)] max-w-md">
            {loadError === 'not-found'
              ? "Non esiste nessun articolo con questo indirizzo. Controlla il link, oppure torna all'elenco: qui non c'è nulla da salvare."
              : "C'è stato un errore di connessione al database. Riprova, oppure torna all'elenco senza salvare nulla."}
          </p>
          <div className="flex items-center gap-3 pt-2">
            {loadError === 'network' && (
              <button
                type="button"
                onClick={fetchArticle}
                className="flex items-center gap-2 bg-[var(--color-ink)] text-white px-6 py-3 rounded-full hover:bg-[var(--color-ink)]/85 transition-colors"
              >
                <RotateCcw size={16} />
                Riprova
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 text-zinc-600 hover:text-zinc-900"
            >
              Torna all'elenco
            </button>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* `maxWidth="wide"` (1440px), non il default: il tetto vero lo mette
          Section sul wrapper interno, quindi una classe qui fuori non lo sposta.
          Con max-w-4xl l'editor stava in 896px e, affiancando scrittura e
          anteprima, le due colonne scendevano a ~400px: l'anteprima mostrava
          40 caratteri per riga contro i 65-75 della pagina pubblicata — piu'
          bugiarda dei 101 di prima, in direzione opposta. */}
      <Section maxWidth="wide" className="pt-32 pb-24 min-h-screen">
        <h1 className="text-4xl font-serif mb-8">{id ? 'Modifica Articolo' : 'Nuovo Articolo'}</h1>

        {draftRecovery && (
          <MessageBanner tone="info">
            <div className="flex flex-col gap-2">
              <p>
                Hai del testo non salvato di {formatDraftTimestamp(draftRecovery.savedAt)}. Vuoi
                riprenderlo?
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleApplyDraft}
                  className="flex items-center gap-1.5 font-medium underline underline-offset-2"
                >
                  <History size={14} />
                  Riprendi
                </button>
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="font-medium underline underline-offset-2"
                >
                  Ignora
                </button>
              </div>
            </div>
          </MessageBanner>
        )}

        {slugConflict && (
          <MessageBanner tone="error" onDismiss={() => setSlugConflict(null)}>
            <div className="flex flex-col gap-2">
              <p>
                Esiste già un articolo con lo slug <strong>"{slugConflict.slug}"</strong>: salvare
                adesso lo sovrascriverebbe senza avviso, e non sarebbe più recuperabile. Cambia lo
                slug qui sotto, oppure usa quello suggerito.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSlug(slugConflict.suggestion);
                  setSlugConflict(null);
                }}
                className="self-start font-medium underline underline-offset-2"
              >
                Usa "{slugConflict.suggestion}"
              </button>
            </div>
          </MessageBanner>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Titolo
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug (URL)
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-2">
                Autore
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Rodrigo e Betta"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Destinazione
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Giappone, Tokyo"
              />
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium mb-2">
                Immagine di copertina (URL)
              </label>
              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                💡 <strong>Pinterest:</strong> per massimizzare le condivisioni usa immagini
                verticali <strong>1000×1500 px</strong> (rapporto 2:3).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Paese
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Italia"
              />
            </div>
            <div>
              <label htmlFor="continent" className="block text-sm font-medium mb-2">
                Continente
              </label>
              <input
                id="continent"
                type="text"
                value={continent}
                onChange={(e) => setContinent(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Asia"
              />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-2">
                Regione / Area
              </label>
              <input
                id="region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Kanto"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                Città / Località
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Roma"
              />
            </div>
            <div>
              <label htmlFor="period" className="block text-sm font-medium mb-2">
                Periodo migliore
              </label>
              <input
                id="period"
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Marzo - Maggio"
              />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium mb-2">
                Budget stimato
              </label>
              <input
                id="budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Medio/Alto"
              />
            </div>
          </div>

          <div>
            <label htmlFor="experienceTypes" className="block text-sm font-medium mb-2">
              Tipologie esperienza
            </label>
            <textarea
              id="experienceTypes"
              rows={4}
              value={experienceTypes}
              onChange={(e) => setExperienceTypes(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder={'Una tipologia per riga\nFood & Ristoranti\nPosti particolari'}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Riassunto / meta description
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium mb-2">
                Tempo di lettura
              </label>
              <input
                id="readTime"
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="6 min"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                Durata consigliata
              </label>
              <input
                id="duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="es. 2-3 Giorni, Weekend, 1 settimana"
              />
            </div>
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">
                Video TikTok / Reel (URL)
              </label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="https://www.tiktok.com/@travellini.withus/video/..."
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                Incolla il link TikTok o YouTube — apparirà nell'articolo come video embed.
              </p>
            </div>
            <div>
              <label htmlFor="mapUrl" className="block text-sm font-medium mb-2">
                Mappa embed URL
              </label>
              <input
                id="mapUrl"
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
              <label htmlFor="content" className="block text-sm font-medium">
                Contenuto
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerifySearch}
                  disabled={isVerifyingSearch || isVerifyingMaps || !content}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                  title="Verifica fatti e informazioni storiche/culturali con Google Search"
                >
                  {isVerifyingSearch ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Search size={14} />
                  )}
                  Verifica Fatti (Search)
                </button>
                <button
                  type="button"
                  onClick={handleVerifyMaps}
                  disabled={isVerifyingSearch || isVerifyingMaps || !content}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-soft)] text-[var(--color-accent-text)] rounded-lg text-xs font-medium hover:bg-[var(--color-accent-hover)]/15 transition-colors disabled:opacity-50"
                  title="Verifica luoghi, indirizzi e logistica con Google Maps"
                >
                  {isVerifyingMaps ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <MapPin size={14} />
                  )}
                  Verifica Luoghi (Maps)
                </button>
              </div>
            </div>
            {verifyMessage && (
              <MessageBanner
                tone={verifyMessage.type === 'success' ? 'success' : 'error'}
                onDismiss={() => setVerifyMessage(null)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span>{verifyMessage.text}</span>
                  {previousContent !== null && verifyMessage.type === 'success' && (
                    <button
                      type="button"
                      onClick={handleUndoVerify}
                      className="flex items-center gap-1.5 font-medium underline underline-offset-2 shrink-0"
                    >
                      <Undo2 size={14} />
                      Torna alla versione precedente
                    </button>
                  )}
                </div>
              </MessageBanner>
            )}
            <MarkdownArticleEditor
              id="content"
              value={content}
              onChange={setContent}
              onIssuesChange={setIssues}
              previewMeta={{
                title,
                description: excerpt,
                image: coverImage,
                category,
                location,
                period,
                budget,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="highlights" className="block text-sm font-medium mb-2">
                Highlights
              </label>
              <textarea
                id="highlights"
                rows={5}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder={'Un highlight per riga'}
              />
            </div>
            <div>
              <label htmlFor="tips" className="block text-sm font-medium mb-2">
                Tips pratici
              </label>
              <textarea
                id="tips"
                rows={5}
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder={'Un consiglio per riga'}
              />
            </div>
            <div>
              <label htmlFor="packingList" className="block text-sm font-medium mb-2">
                Cosa portare
              </label>
              <textarea
                id="packingList"
                rows={5}
                value={packingList}
                onChange={(e) => setPackingList(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder={'Un elemento per riga'}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 accent-[var(--color-accent)]"
            />
            <label htmlFor="published" className="font-medium">
              Pubblica immediatamente
            </label>
          </div>

          <div className="pt-6 border-t border-zinc-100 space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                {published ? (
                  <CircleCheck size={14} className="text-[var(--color-accent-text)]" />
                ) : (
                  <FileText size={14} />
                )}
                {published ? 'Pubblicato' : 'Bozza'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {dirty
                  ? 'Modifiche non salvate'
                  : lastSavedAt
                    ? `Salvato alle ${formatTime(lastSavedAt)}`
                    : 'Non ancora salvato'}
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle
                  size={14}
                  className={issues.length > 0 ? 'text-[var(--color-error-text)]' : ''}
                />
                {issues.length === 0
                  ? 'Nessun problema di sintassi'
                  : issues.length === 1
                    ? '1 cosa da correggere'
                    : `${issues.length} cose da correggere`}
              </span>
            </div>

            {saveError && (
              <MessageBanner tone="error" onDismiss={() => setSaveError(null)}>
                {saveError}
              </MessageBanner>
            )}

            {saveTimedOut && (
              <MessageBanner tone="warning">
                Il salvataggio sta impiegando più del previsto — probabile problema di connessione.
                Il testo non è ancora confermato: non chiudere questa pagina.
              </MessageBanner>
            )}

            {confirmDiscard && (
              <MessageBanner tone="warning">
                <div className="flex flex-col gap-2">
                  <p>Ci sono modifiche non salvate: uscendo andranno perse. Confermi?</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleConfirmDiscard}
                      className="font-medium underline underline-offset-2"
                    >
                      Sì, esci senza salvare
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDiscard(false)}
                      className="font-medium underline underline-offset-2"
                    >
                      Continua a modificare
                    </button>
                  </div>
                </div>
              </MessageBanner>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-6 py-3 text-zinc-600 hover:text-zinc-900"
              >
                Torna all'elenco
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--color-ink)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-ink)]/85 transition-colors disabled:opacity-50"
              >
                {saving
                  ? saveTimedOut
                    ? 'Salvataggio non confermato…'
                    : 'Salvataggio...'
                  : 'Salva Articolo'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 pt-12 border-t border-zinc-100">
          <SEOPreview
            title={title}
            description={excerpt}
            slug={slug}
            imageUrl={coverImage}
            type="article"
          />
        </div>
      </Section>
    </PageLayout>
  );
}
