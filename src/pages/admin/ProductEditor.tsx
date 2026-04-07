import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import FormSkeleton from '../../components/FormSkeleton';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEOPreview from '../../components/SEOPreview';

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('preset');
  const [isDigital, setIsDigital] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setSlug(data.slug || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setImageUrl(data.imageUrl || '');
          setCategory(data.category || 'preset');
          setIsDigital(data.isDigital !== false);
          setDownloadUrl(data.downloadUrl || '');
          setPublished(data.published === true);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const productId = id || slug || Date.now().toString();
    const docRef = doc(db, 'products', productId);

    const productData = {
      name,
      slug,
      description,
      price: Number(price),
      imageUrl,
      category,
      isDigital,
      downloadUrl: downloadUrl || null,
      published,
      updatedAt: serverTimestamp(),
      ...(id ? {} : { createdAt: serverTimestamp() }),
    };

    try {
      await setDoc(docRef, productData, { merge: true });
      navigate('/admin');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productId}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <PageLayout>
      <Section className="pt-32 pb-24 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-4xl font-serif mb-8">{id ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome Prodotto
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Prezzo (EUR)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-white"
              >
                <option value="preset">Preset fotografico</option>
                <option value="guide">Guida premium</option>
                <option value="itinerary">Itinerario premium</option>
                <option value="planner">Planner digitale</option>
                <option value="digital-planner">Digital planner</option>
                <option value="bundle">Bundle</option>
                <option value="map">Mappa digitale</option>
              </select>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
                Immagine (URL)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <label
                htmlFor="isDigital"
                className="flex items-center justify-between gap-6 cursor-pointer"
              >
                <div>
                  <span className="block text-sm font-medium text-zinc-900">Prodotto digitale</span>
                  <span className="block text-xs text-zinc-500 mt-1">
                    Se attivo, il prodotto può prevedere un link di download associato
                    all&apos;ordine.
                  </span>
                </div>
                <input
                  id="isDigital"
                  type="checkbox"
                  aria-label="Prodotto digitale"
                  checked={isDigital}
                  onChange={(event) => setIsDigital(event.target.checked)}
                  className="h-5 w-5 rounded border-zinc-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
              </label>
            </div>

            <div>
              <label htmlFor="downloadUrl" className="block text-sm font-medium mb-2">
                Link download
              </label>
              <input
                id="downloadUrl"
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <label
              htmlFor="published"
              className="flex items-center justify-between gap-6 cursor-pointer"
            >
              <div>
                <span className="block text-sm font-medium text-zinc-900">Prodotto pubblicato</span>
                <span className="block text-xs text-zinc-500 mt-1">
                  Attivalo solo quando vuoi mostrare davvero questo prodotto nello shop pubblico.
                </span>
              </div>
              <input
                id="published"
                type="checkbox"
                aria-label="Prodotto pubblicato"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-5 w-5 rounded border-zinc-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descrizione
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[var(--color-accent)]"
            />
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
              {saving ? 'Salvataggio...' : 'Salva Prodotto'}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-12 border-t border-zinc-100">
          <SEOPreview
            title={name}
            description={description}
            slug={slug}
            imageUrl={imageUrl}
            type="product"
          />
        </div>
      </Section>
    </PageLayout>
  );
}
