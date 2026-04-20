import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import FormSkeleton from '../../components/FormSkeleton';
import { verifyWithSearch, verifyWithMaps } from '../../services/aiVerificationService';
import { Search, MapPin, Loader2 } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEOPreview from '../../components/SEOPreview';
import { summarizeValidation, validateArticle } from '../../utils/articleValidator';

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
  const [readTime, setReadTime] = useState('');
  const [tips, setTips] = useState('');
  const [packingList, setPackingList] = useState('');
  const [highlights, setHighlights] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [published, setPublished] = useState(false);
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
          setExperienceTypes(Array.isArray(data.experienceTypes) ? data.experienceTypes.join('\n') : '');
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
      alert("Verifica dei fatti completata con successo! Il contenuto è stato aggiornato.");
    } catch (error) {
      console.error("Errore durante la verifica con Search:", error);
      alert("Si è verificato un errore durante la verifica dei fatti.");
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
      alert("Verifica geografica completata con successo! Il contenuto è stato aggiornato.");
    } catch (error) {
      console.error("Errore durante la verifica con Maps:", error);
      alert("Si è verificato un errore durante la verifica geografica.");
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
          author,
        })
      );
      if (!report.canPublish) {
        const lines = report.errors
          .map((issue) => `• [${issue.field}] ${issue.message}${issue.hint ? ` — ${issue.hint}` : ''}`)
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
      ...(id ? {} : { createdAt: serverTimestamp() })
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

  return (
    <PageLayout>
      <Section className="pt-32 pb-24 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl font-serif mb-8">{id ? 'Modifica Articolo' : 'Nuovo Articolo'}</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Titolo</label>
            <input 
              id="title"
              type="text" required
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug (URL)</label>
            <input 
              id="slug"
              type="text" required
              value={slug} onChange={e => setSlug(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">Categoria</label>
            <input 
              id="category"
              type="text" 
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">Autore</label>
            <input
              id="author"
              type="text"
              value={author} onChange={e => setAuthor(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Rodrigo e Betta"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">Destinazione</label>
            <input
              id="location"
              type="text"
              value={location} onChange={e => setLocation(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Giappone, Tokyo"
            />
          </div>
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-2">Immagine di copertina (URL)</label>
            <input
              id="coverImage"
              type="url"
              value={coverImage} onChange={e => setCoverImage(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
            <p className="text-xs text-zinc-400 mt-1.5">
              💡 <strong>Pinterest:</strong> per massimizzare le condivisioni usa immagini verticali <strong>1000×1500 px</strong> (rapporto 2:3).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">Paese</label>
            <input
              id="country"
              type="text"
              value={country} onChange={e => setCountry(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Italia"
            />
          </div>
          <div>
            <label htmlFor="continent" className="block text-sm font-medium mb-2">Continente</label>
            <input
              id="continent"
              type="text"
              value={continent} onChange={e => setContinent(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Asia"
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-2">Regione / Area</label>
            <input
              id="region"
              type="text"
              value={region} onChange={e => setRegion(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Kanto"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">Città / Località</label>
            <input
              id="city"
              type="text"
              value={city} onChange={e => setCity(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Roma"
            />
          </div>
          <div>
            <label htmlFor="period" className="block text-sm font-medium mb-2">Periodo migliore</label>
            <input
              id="period"
              type="text"
              value={period} onChange={e => setPeriod(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Marzo - Maggio"
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-2">Budget stimato</label>
            <input
              id="budget"
              type="text"
              value={budget} onChange={e => setBudget(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="Medio/Alto"
            />
          </div>
        </div>

        <div>
          <label htmlFor="experienceTypes" className="block text-sm font-medium mb-2">Tipologie esperienza</label>
          <textarea
            id="experienceTypes"
            rows={4}
            value={experienceTypes} onChange={e => setExperienceTypes(e.target.value)}
            className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            placeholder={'Una tipologia per riga\nFood & Ristoranti\nPosti particolari'}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">Riassunto / meta description</label>
          <textarea 
            id="excerpt"
            rows={3}
            value={excerpt} onChange={e => setExcerpt(e.target.value)}
            className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="readTime" className="block text-sm font-medium mb-2">Tempo di lettura</label>
            <input
              id="readTime"
              type="text"
              value={readTime} onChange={e => setReadTime(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="6 min"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-2">Durata consigliata</label>
            <input
              id="duration"
              type="text"
              value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="es. 2-3 Giorni, Weekend, 1 settimana"
            />
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">Video TikTok / Reel (URL)</label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="https://www.tiktok.com/@travelliniwithus/video/..."
            />
            <p className="text-xs text-zinc-400 mt-1.5">Incolla il link TikTok o YouTube — apparirà nell'articolo come video embed.</p>
          </div>
          <div>
            <label htmlFor="mapUrl" className="block text-sm font-medium mb-2">Mappa embed URL</label>
            <input
              id="mapUrl"
              type="url"
              value={mapUrl} onChange={e => setMapUrl(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
            <label htmlFor="content" className="block text-sm font-medium">Contenuto</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifySearch}
                disabled={isVerifyingSearch || isVerifyingMaps || !content}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                title="Verifica fatti e informazioni storiche/culturali con Google Search"
              >
                {isVerifyingSearch ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Verifica Fatti (Search)
              </button>
              <button
                type="button"
                onClick={handleVerifyMaps}
                disabled={isVerifyingSearch || isVerifyingMaps || !content}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-lg text-xs font-medium hover:bg-[var(--color-accent)]/15 transition-colors disabled:opacity-50"
                title="Verifica luoghi, indirizzi e logistica con Google Maps"
              >
                {isVerifyingMaps ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                Verifica Luoghi (Maps)
              </button>
            </div>
          </div>
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-96 mb-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="highlights" className="block text-sm font-medium mb-2">Highlights</label>
            <textarea
              id="highlights"
              rows={5}
              value={highlights} onChange={e => setHighlights(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder={'Un highlight per riga'}
            />
          </div>
          <div>
            <label htmlFor="tips" className="block text-sm font-medium mb-2">Tips pratici</label>
            <textarea
              id="tips"
              rows={5}
              value={tips} onChange={e => setTips(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder={'Un consiglio per riga'}
            />
          </div>
          <div>
            <label htmlFor="packingList" className="block text-sm font-medium mb-2">Cosa portare</label>
            <textarea
              id="packingList"
              rows={5}
              value={packingList} onChange={e => setPackingList(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              placeholder={'Un elemento per riga'}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" id="published"
            checked={published} onChange={e => setPublished(e.target.checked)}
            className="w-5 h-5 accent-[var(--color-accent)]"
          />
          <label htmlFor="published" className="font-medium">Pubblica immediatamente</label>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100">
          <button 
            type="button" onClick={() => navigate('/admin')}
            className="px-6 py-3 text-zinc-600 hover:text-zinc-900"
          >
            Annulla
          </button>
          <button 
            type="submit" disabled={saving}
            className="bg-[var(--color-ink)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-ink)]/85 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva Articolo'}
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
        />
      </div>
    </Section>
  </PageLayout>
  );
}
