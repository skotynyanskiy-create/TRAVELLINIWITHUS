import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { Timestamp, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  Plus,
  Trash2,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEOPreview from '../../components/SEOPreview';
import { getPublicArticlePath } from '../../utils/articleRoutes';
import { summarizeValidation, validateArticle } from '../../utils/articleValidator';
import {
  ARTICLE_BUDGET_BANDS,
  ARTICLE_DISCLOSURE_LABELS,
  ARTICLE_DISCLOSURE_TYPES,
  ARTICLE_FEATURED_PLACEMENTS,
  ARTICLE_TYPES,
  type ArticleEditorialFormat,
  type ArticleBudgetBand,
  type ArticleDisclosureType,
  type ArticleFeaturedPlacement,
  type ArticleType,
  type HotelRecommendation,
} from '../../components/article';
import { EXPERIENCE_TYPES } from '../../config/contentTaxonomy';

type ShopCtaProductType = 'maps' | 'presets' | 'ebook';

const SHOP_CTA_TYPES: ShopCtaProductType[] = ['maps', 'presets', 'ebook'];
const ITINERARY_CATEGORY_SET = new Set(['Itinerari completi', 'Weekend & Day trip']);
const LEGACY_DISCLOSURE_MAP: Record<string, ArticleDisclosureType> = {
  Affiliazioni: 'affiliate',
  Ospitati: 'gifted',
  Pagato: 'sponsored',
  'Viaggio personale': 'none',
};

const EMPTY_HOTEL: HotelRecommendation = {
  name: '',
  image: '',
  bookingUrl: '',
  category: '',
  priceHint: '',
  badge: '',
};

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

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
  const [budgetBand, setBudgetBand] = useState<ArticleBudgetBand | ''>('');
  const [readTime, setReadTime] = useState('');
  const [tripIntents, setTripIntents] = useState('');
  const [verifiedAt, setVerifiedAt] = useState('');
  const [disclosureType, setDisclosureType] = useState<ArticleDisclosureType | ''>('');
  const [featuredPlacement, setFeaturedPlacement] = useState<ArticleFeaturedPlacement | ''>('');
  const [tips, setTips] = useState('');
  const [packingList, setPackingList] = useState('');
  const [highlights, setHighlights] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [articleType, setArticleType] = useState<ArticleType>('guide');
  const [editorialFormat, setEditorialFormat] = useState<ArticleEditorialFormat>('guide');
  const [hotels, setHotels] = useState<HotelRecommendation[]>([]);
  const [shopCtaProductType, setShopCtaProductType] = useState<ShopCtaProductType | ''>('');
  const [shopCtaProductUrl, setShopCtaProductUrl] = useState('');
  const [shopCtaCount, setShopCtaCount] = useState('');
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);

  const [isVerifyingSearch, setIsVerifyingSearch] = useState(false);
  const [isVerifyingMaps, setIsVerifyingMaps] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
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
          setBudgetBand((data.budgetBand as ArticleBudgetBand | undefined) || '');
          setReadTime(data.readTime || '');
          setTripIntents(Array.isArray(data.tripIntents) ? data.tripIntents.join('\n') : '');
          setVerifiedAt(
            data.verifiedAt && typeof data.verifiedAt === 'object' && 'toDate' in data.verifiedAt
              ? (data.verifiedAt as Timestamp).toDate().toISOString().slice(0, 10)
              : ''
          );
          setDisclosureType(
            data.disclosureType && typeof data.disclosureType === 'string'
              ? (LEGACY_DISCLOSURE_MAP[data.disclosureType] ??
                  (data.disclosureType as ArticleDisclosureType))
              : ''
          );
          setFeaturedPlacement(
            (data.featuredPlacement as ArticleFeaturedPlacement | undefined) || ''
          );
          setTips(Array.isArray(data.tips) ? data.tips.join('\n') : '');
          setPackingList(Array.isArray(data.packingList) ? data.packingList.join('\n') : '');
          setHighlights(Array.isArray(data.highlights) ? data.highlights.join('\n') : '');
          setMapUrl(data.mapUrl || '');
          setDuration(data.duration || '');
          setVideoUrl(data.videoUrl || '');
          setPublished(data.published || false);
          const loadedType = data.type;
          if (loadedType === 'pillar' || loadedType === 'guide' || loadedType === 'itinerary') {
            setArticleType(loadedType);
          } else if (loadedType === 'article') {
            setArticleType('guide');
          } else {
            setArticleType(
              data.category === 'Itinerari completi' || data.category === 'Weekend & Day trip'
                ? 'itinerary'
                : 'guide'
            );
          }
          setEditorialFormat(
            data.category === 'Itinerari completi' || data.category === 'Weekend & Day trip'
              ? 'itinerary'
              : 'guide'
          );
          setHotels(Array.isArray(data.hotels) ? (data.hotels as HotelRecommendation[]) : []);
          if (data.shopCta && typeof data.shopCta === 'object') {
            const cta = data.shopCta as Record<string, unknown>;
            const ctaType = cta.productType;
            if (
              typeof ctaType === 'string' &&
              SHOP_CTA_TYPES.includes(ctaType as ShopCtaProductType)
            ) {
              setShopCtaProductType(ctaType as ShopCtaProductType);
            }
            setShopCtaProductUrl(typeof cta.productUrl === 'string' ? cta.productUrl : '');
            setShopCtaCount(typeof cta.count === 'number' ? String(cta.count) : '');
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `articles/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleVerifySearch = async () => {
    if (!content) return;
    setIsVerifyingSearch(true);
    try {
      const verifiedContent = await verifyWithSearch(content, title);
      setContent(verifiedContent);
      alert('Verifica dei fatti completata con successo! Il contenuto è stato aggiornato.');
    } catch (error) {
      console.error('Errore durante la verifica con Search:', error);
      alert('Si è verificato un errore durante la verifica dei fatti.');
    } finally {
      setIsVerifyingSearch(false);
    }
  };

  const handleVerifyMaps = async () => {
    if (!content) return;
    setIsVerifyingMaps(true);
    try {
      const verifiedContent = await verifyWithMaps(content, title);
      setContent(verifiedContent);
      alert('Verifica geografica completata con successo! Il contenuto è stato aggiornato.');
    } catch (error) {
      console.error('Errore durante la verifica con Maps:', error);
      alert('Si è verificato un errore durante la verifica geografica.');
    } finally {
      setIsVerifyingMaps(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (published) {
      const report = summarizeValidation(
        validateArticle({
          title,
          slug,
          excerpt,
          description: excerpt,
          content,
          coverImage,
          image: coverImage,
          category,
          type: articleType,
          author,
          budgetBand: budgetBand || undefined,
          tripIntents: splitLines(tripIntents),
          verifiedAt: verifiedAt || undefined,
          disclosureType: disclosureType || undefined,
          featuredPlacement: featuredPlacement || undefined,
          hotels,
          shopCta: shopCtaProductType
            ? { productType: shopCtaProductType, productUrl: shopCtaProductUrl.trim() || '/shop' }
            : undefined,
        })
      );
      if (!report.canPublish) {
        const lines = report.errors
          .map(
            (issue) => `• [${issue.field}] ${issue.message}${issue.hint ? ` — ${issue.hint}` : ''}`
          )
          .join('\n');
        alert(
          `Non posso pubblicare: ${report.errorCount} errore/i da correggere.\n\n${lines}\n\nPuoi comunque salvare come bozza togliendo il flag "Pubblica immediatamente".`
        );
        return;
      }
      if (report.warningCount > 0) {
        const warnLines = report.warnings
          .map((issue) => `• [${issue.field}] ${issue.message}`)
          .join('\n');
        const ok = window.confirm(
          `Check editoriale: ${report.warningCount} avviso/i.\n\n${warnLines}\n\nVuoi pubblicare comunque?`
        );
        if (!ok) return;
      }
    }

    setSaving(true);

    const articleId = id || slug || Date.now().toString();
    const docRef = doc(db, 'articles', articleId);

    const normalizedHotels = hotels
      .map((hotel) => ({
        name: hotel.name.trim(),
        image: hotel.image.trim(),
        bookingUrl: hotel.bookingUrl.trim(),
        category: hotel.category?.trim() || undefined,
        priceHint: hotel.priceHint?.trim() || undefined,
        badge: hotel.badge?.trim() || undefined,
        rating: typeof hotel.rating === 'number' ? hotel.rating : undefined,
      }))
      .filter((hotel) => hotel.name && hotel.image && hotel.bookingUrl);

    const shopCtaPayload =
      shopCtaProductType && shopCtaProductUrl.trim()
        ? {
            productType: shopCtaProductType,
            productUrl: shopCtaProductUrl.trim(),
            count: shopCtaCount.trim() ? Number(shopCtaCount) : undefined,
          }
        : null;

    const articleData = {
      title,
      slug,
      excerpt,
      description: excerpt,
      content,
      coverImage,
      category,
      type: articleType,
      author,
      location,
      country,
      region,
      city,
      continent,
      experienceTypes: splitLines(experienceTypes),
      period,
      budget,
      budgetBand: budgetBand || null,
      readTime,
      tripIntents: splitLines(tripIntents),
      verifiedAt: verifiedAt ? Timestamp.fromDate(new Date(`${verifiedAt}T12:00:00`)) : null,
      disclosureType: disclosureType || null,
      featuredPlacement: featuredPlacement || null,
      tips: splitLines(tips),
      packingList: splitLines(packingList),
      highlights: splitLines(highlights),
      mapUrl,
      duration: duration || null,
      videoUrl: videoUrl || null,
      hotels: normalizedHotels,
      shopCta: shopCtaPayload,
      published,
      authorId: user.uid,
      updatedAt: serverTimestamp(),
      ...(id ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      await setDoc(docRef, articleData, { merge: true });
      navigate('/admin');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `articles/${articleId}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FormSkeleton />;

  const publicPreviewPath = getPublicArticlePath({
    slug,
    category,
    type: articleType,
  });

  // Validazione visiva in tempo reale
  const validationReport = summarizeValidation(
    validateArticle({
      title,
      slug,
      excerpt,
      description: excerpt,
      content,
      coverImage,
      image: coverImage,
      category,
      type: articleType,
      author,
      budgetBand: budgetBand || undefined,
      tripIntents: splitLines(tripIntents),
      verifiedAt: verifiedAt || undefined,
      disclosureType: disclosureType || undefined,
      featuredPlacement: featuredPlacement || undefined,
      hotels,
      shopCta: shopCtaProductType
        ? { productType: shopCtaProductType, productUrl: shopCtaProductUrl.trim() || '/shop' }
        : undefined,
    })
  );

  return (
    <PageLayout>
      <Section className="pt-32 pb-24 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl font-serif mb-8">
          {id ? 'Modifica contenuto editoriale' : 'Nuovo contenuto editoriale'}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Titolo <span className="text-[var(--color-accent)]">*</span>
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
                Slug (URL) <span className="text-[var(--color-accent)]">*</span>
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
                Categoria editoriale <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => {
                  const nextCategory = e.target.value;
                  setCategory(nextCategory);
                  setEditorialFormat(
                    ITINERARY_CATEGORY_SET.has(nextCategory) ? 'itinerary' : 'guide'
                  );
                }}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
              <p className="mt-1.5 text-xs text-zinc-400">
                Le categorie <strong>Itinerari completi</strong> e{' '}
                <strong>Weekend &amp; Day trip</strong> pubblicano su <code>/itinerari</code>. Tutte
                le altre categorie vanno nel layer <code>/guide</code>.
              </p>
              <p className="mt-1.5 text-xs text-zinc-500">
                Route pubblica attesa:{' '}
                <code>{editorialFormat === 'itinerary' ? '/itinerari' : '/guide'}</code>
              </p>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-2">
                Autore <span className="text-[var(--color-accent)]">*</span>
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
                Immagine di copertina (URL) <span className="text-[var(--color-accent)]">*</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budgetBand" className="block text-sm font-medium mb-2">
                Fascia budget
              </label>
              <select
                id="budgetBand"
                value={budgetBand}
                onChange={(e) => setBudgetBand(e.target.value as ArticleBudgetBand | '')}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
              >
                <option value="">Seleziona fascia</option>
                {ARTICLE_BUDGET_BANDS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="articleType" className="block text-sm font-medium mb-2">
                Formato del pezzo
              </label>
              <select
                id="articleType"
                value={articleType}
                onChange={(e) => setArticleType(e.target.value as ArticleType)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
              >
                {ARTICLE_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item === 'pillar'
                      ? 'Pillar / flagship'
                      : item === 'itinerary'
                        ? 'Itinerario'
                        : 'Guida pratica'}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-zinc-400">
                Il formato decide profondita e struttura. Un <strong>pillar</strong> puo essere sia
                una guida pratica flagship sia un itinerario principale.
              </p>
            </div>
            <div>
              <label htmlFor="featuredPlacement" className="block text-sm font-medium mb-2">
                Featured placement
              </label>
              <select
                id="featuredPlacement"
                value={featuredPlacement}
                onChange={(e) =>
                  setFeaturedPlacement(e.target.value as ArticleFeaturedPlacement | '')
                }
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
              >
                <option value="">Nessuna vetrina</option>
                {ARTICLE_FEATURED_PLACEMENTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="verifiedAt" className="block text-sm font-medium mb-2">
                Verificato il <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="verifiedAt"
                type="date"
                value={verifiedAt}
                onChange={(e) => setVerifiedAt(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label htmlFor="disclosureType" className="block text-sm font-medium mb-2">
                Disclosure <span className="text-[var(--color-accent)]">*</span>
              </label>
              <select
                id="disclosureType"
                value={disclosureType}
                onChange={(e) => setDisclosureType(e.target.value as ArticleDisclosureType | '')}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
              >
                <option value="">Seleziona disclosure</option>
                {ARTICLE_DISCLOSURE_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {ARTICLE_DISCLOSURE_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experienceTypes" className="block text-sm font-medium mb-2">
                Tipologie esperienza
              </label>
              <textarea
                id="experienceTypes"
                rows={6}
                value={experienceTypes}
                onChange={(e) => setExperienceTypes(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder={'Una tipologia per riga\nFood & Ristoranti\nPosti particolari'}
              />
              <p className="mt-1.5 text-xs text-zinc-400">
                Tassonomia archivio. Usa le etichette gia presenti nel sito.
              </p>
            </div>
            <div>
              <label htmlFor="tripIntents" className="block text-sm font-medium mb-2">
                Intenti di viaggio
              </label>
              <textarea
                id="tripIntents"
                rows={6}
                value={tripIntents}
                onChange={(e) => setTripIntents(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
                placeholder={EXPERIENCE_TYPES.slice(0, 4).join('\n')}
              />
              <p className="mt-1.5 text-xs text-zinc-400">
                1-3 intenti utili per home, hub e box decisionali.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Riassunto / meta description <span className="text-[var(--color-accent)]">*</span>
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
                placeholder="https://www.tiktok.com/@travelliniwithus/video/..."
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
                Contenuto <span className="text-[var(--color-accent)]">*</span>
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
                  className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-lg text-xs font-medium hover:bg-[var(--color-accent)]/15 transition-colors disabled:opacity-50"
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
            <ReactQuill theme="snow" value={content} onChange={setContent} className="h-96 mb-12" />
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif">
                  Hotel consigliati{' '}
                  {articleType === 'pillar' && (
                    <span className="text-[var(--color-accent)]">*</span>
                  )}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Fino a 3 hotel curati. Appaiono in articolo (HotelRecommendations) e feed
                  strutturato LodgingBusiness.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHotels([...hotels, { ...EMPTY_HOTEL }])}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:border-[var(--color-accent)]"
              >
                <Plus size={14} /> Aggiungi hotel
              </button>
            </div>

            {hotels.length === 0 && (
              <p className="text-sm text-zinc-400 italic">
                Nessun hotel inserito. Aggiungine uno per mostrare la sezione "Dove dormire"
                nell'articolo.
              </p>
            )}

            <div className="space-y-4">
              {hotels.map((hotel, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Hotel #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHotels(hotels.filter((_, i) => i !== idx))}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={13} /> Rimuovi
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={hotel.name}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) => (i === idx ? { ...h, name: e.target.value } : h))
                        )
                      }
                      placeholder="Nome hotel"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="url"
                      value={hotel.bookingUrl}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) =>
                            i === idx ? { ...h, bookingUrl: e.target.value } : h
                          )
                        )
                      }
                      placeholder="URL Booking.com"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="url"
                      value={hotel.image}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) => (i === idx ? { ...h, image: e.target.value } : h))
                        )
                      }
                      placeholder="URL immagine"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] md:col-span-2"
                    />
                    <input
                      type="text"
                      value={hotel.category || ''}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) => (i === idx ? { ...h, category: e.target.value } : h))
                        )
                      }
                      placeholder="Categoria (es. Wellness in quota)"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="text"
                      value={hotel.badge || ''}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) => (i === idx ? { ...h, badge: e.target.value } : h))
                        )
                      }
                      placeholder="Badge (es. Nostra scelta)"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="text"
                      value={hotel.priceHint || ''}
                      onChange={(e) =>
                        setHotels(
                          hotels.map((h, i) =>
                            i === idx ? { ...h, priceHint: e.target.value } : h
                          )
                        )
                      }
                      placeholder="Price hint (es. €420)"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={typeof hotel.rating === 'number' ? hotel.rating : ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setHotels(
                          hotels.map((h, i) =>
                            i === idx ? { ...h, rating: raw ? Number(raw) : undefined } : h
                          )
                        );
                      }}
                      placeholder="Rating /10 (es. 9.4)"
                      className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-serif">Shop CTA contestuale</h3>
            <p className="mt-1 mb-4 text-xs text-zinc-400">
              CTA verso uno shop prodotto (Google Maps, preset, ebook) che appare dopo la mappa.
              Lascia vuoto per nasconderla.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label
                  htmlFor="shopCtaType"
                  className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5"
                >
                  Tipo prodotto
                </label>
                <select
                  id="shopCtaType"
                  value={shopCtaProductType}
                  onChange={(e) => setShopCtaProductType(e.target.value as ShopCtaProductType | '')}
                  className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="">Nessuno</option>
                  {SHOP_CTA_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === 'maps'
                        ? 'Google Maps'
                        : type === 'presets'
                          ? 'Preset Lightroom'
                          : 'Ebook guida'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="shopCtaUrl"
                  className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5"
                >
                  Link prodotto
                </label>
                <input
                  id="shopCtaUrl"
                  type="text"
                  value={shopCtaProductUrl}
                  onChange={(e) => setShopCtaProductUrl(e.target.value)}
                  placeholder="/shop/mappa-xyz"
                  className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="shopCtaCount"
                  className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5"
                >
                  Quantità (opz.)
                </label>
                <input
                  id="shopCtaCount"
                  type="number"
                  min="0"
                  value={shopCtaCount}
                  onChange={(e) => setShopCtaCount(e.target.value)}
                  placeholder="es. 18 location"
                  className="w-full rounded-lg border border-zinc-200 p-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>

          {/* Validation Panel Real-time */}
          <div
            className={`rounded-2xl border p-6 ${validationReport.canPublish ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'}`}
          >
            <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
              Status Editoriale
              {validationReport.canPublish ? (
                <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100/70 px-2 py-1 rounded-full">
                  Pubblicabile
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100/70 px-2 py-1 rounded-full">
                  Bozza (Richiede fix)
                </span>
              )}
            </h3>

            <div className="space-y-3 text-sm">
              {validationReport.errors.map((e, i) => (
                <p key={`err-${i}`} className="text-red-700 flex items-start gap-2">
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>{e.field}:</strong> {e.message}.{' '}
                    <span className="opacity-70">{e.hint}</span>
                  </span>
                </p>
              ))}
              {validationReport.warnings.map((w, i) => (
                <p key={`warn-${i}`} className="text-amber-700 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>{w.field}:</strong> {w.message}.{' '}
                    <span className="opacity-70">{w.hint}</span>
                  </span>
                </p>
              ))}
              {validationReport.errors.length === 0 && validationReport.warnings.length === 0 && (
                <p className="text-green-700 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Il contenuto rispetta rigorosamente tutti gli standard premium.
                </p>
              )}
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

          <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 text-zinc-600 hover:text-zinc-900"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[var(--color-ink)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-ink)]/85 transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvataggio...' : 'Salva contenuto'}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-12 border-t border-zinc-100">
          <SEOPreview
            title={title}
            description={excerpt}
            slug={slug}
            imageUrl={coverImage}
            type="article"
            path={publicPreviewPath}
          />
        </div>
      </Section>
    </PageLayout>
  );
}
