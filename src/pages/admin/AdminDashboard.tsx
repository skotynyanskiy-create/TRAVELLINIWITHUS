import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { Link } from 'react-router-dom';
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  Package,
  FileText,
  BarChart3,
  Save,
  Loader2,
  TrendingUp,
  Image as ImageIcon,
  ShoppingBag,
  Database,
  LayoutDashboard,
  Search,
  Mail,
  Ticket,
  History,
  Download,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import {
  fetchStats,
  updateStats,
  SiteStats,
  seedTestData,
  logActivity,
  exportToCSV,
} from '../../services/firebaseService';
import { useAuth } from '../../context/AuthContext';
import ListSkeleton from '../../components/ListSkeleton';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import MediaManager from '../../components/MediaManager';
import Orders from './Orders';
import Users from './Users';
import CouponManager from '../../components/CouponManager';
import AuditLog from '../../components/AuditLog';
import { siteContentDefinitions } from '../../config/siteContent';
import {
  getPublicArticlePath,
  getPublicArticleSection,
  getPublicSectionLabel,
} from '../../utils/articleRoutes';
import type { ArticleType } from '../../components/article';

// Mock data for analytics
const data = [
  { name: 'Gen', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'Mag', sales: 1890 },
  { name: 'Giu', sales: 2390 },
];

interface TimestampLike {
  toDate: () => Date;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  type?: ArticleType;
  createdAt?: unknown;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt?: unknown;
}

interface Lead {
  id: string;
  email: string;
  company?: string;
  type?: 'contact' | 'newsletter' | 'media-kit';
  topic?: string;
  website?: string;
  message?: string;
  createdAt?: unknown;
}

interface UserDoc {
  id: string;
  role: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const isPreviewMode = !user;
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<SiteStats>({
    igFollowers: '250K+',
    monthlyReach: '500K+',
    uniqueUsers: '50K+',
    engagementRate: '8.5%',
  });
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'pages'
    | 'articles'
    | 'products'
    | 'stats'
    | 'analytics'
    | 'media'
    | 'orders'
    | 'users'
    | 'coupons'
    | 'logs'
  >('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Articles
      const articlesSnapshot = await getDocs(collection(db, 'articles'));
      const fetchedArticles: Article[] = [];
      articlesSnapshot.forEach((doc) => {
        fetchedArticles.push({ id: doc.id, ...doc.data() } as Article);
      });
      setArticles(fetchedArticles);

      // Fetch Products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const fetchedProducts: Product[] = [];
      productsSnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);

      // Fetch Orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const fetchedOrders: Order[] = [];
      ordersSnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);

      // Fetch Users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: UserDoc[] = [];
      usersSnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as UserDoc);
      });
      setUsers(fetchedUsers);

      // Fetch Leads
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      const fetchedLeads: Lead[] = [];
      leadsSnapshot.forEach((doc) => {
        fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(fetchedLeads);

      // Fetch Stats
      const fetchedStats = await fetchStats();
      if (fetchedStats) {
        setStats(fetchedStats);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!user || !window.confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      await logActivity('Articolo Eliminato', user.email || 'Admin', `ID: ${id}`);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user || !window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      await logActivity('Prodotto Eliminato', user.email || 'Admin', `ID: ${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleSaveStats = async () => {
    if (!user) return;
    setSavingStats(true);
    try {
      await updateStats(stats);
      await logActivity('Statistiche Aggiornate', user.email || 'Admin');
      alert('Statistiche aggiornate con successo!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/stats');
    } finally {
      setSavingStats(false);
    }
  };

  const handleSeedData = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      await seedTestData(user.uid);
      await logActivity('Dati Seed Generati', user.email || 'Admin');
      alert('Dati di prova generati con successo! Ricarica la pagina per vederli.');
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seed_data');
    } finally {
      setSeeding(false);
    }
  };

  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.status === 'completed' ? order.total : 0),
    0
  );
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleExportCsv = () => {
    if (activeTab === 'orders') {
      exportToCSV(orders, 'ordini');
      return;
    }

    exportToCSV(leads, 'leads');
  };

  return (
    <PageLayout>
      <Section className="pt-32 pb-24 min-h-screen">
        {isPreviewMode && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
            Modalita anteprima admin locale attiva. Puoi esplorare struttura e editor, ma le azioni
            che scrivono dati reali restano disattivate finche non completi il login Firebase.
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Pannello di Amministrazione</h1>
            <p className="text-zinc-500">Bentornato, ecco cosa succede oggi.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSeedData}
              disabled={seeding || isPreviewMode}
              className="bg-zinc-100 text-zinc-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {seeding ? <Loader2 size={20} className="animate-spin" /> : <Database size={20} />}
              Genera Dati Prova
            </button>
            {['articles', 'products'].includes(activeTab) && (
              <Link
                to={activeTab === 'articles' ? '/admin/editor' : '/admin/product-editor'}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-colors ${
                  isPreviewMode
                    ? 'pointer-events-none bg-zinc-300 text-white'
                    : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]'
                }`}
              >
                <Plus size={20} /> Nuovo {activeTab === 'articles' ? 'contenuto' : 'prodotto'}
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'pages'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Edit size={18} /> Pagine sito
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <FileText size={18} /> Editoriale
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Package size={18} /> Prodotti
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ShoppingBag size={18} /> Ordini
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <UsersIcon size={18} /> Utenti
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ImageIcon size={18} /> Media
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Ticket size={18} /> Coupon
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <History size={18} /> Logs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <TrendingUp size={18} /> Analisi
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-[var(--color-ink)] text-white shadow-lg shadow-black/10'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <BarChart3 size={18} /> Statistiche B2B
          </button>
        </div>

        {activeTab === 'overview' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-xl">
                  <ShoppingBag size={24} />
                </div>
                {pendingOrders > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                    {pendingOrders} Nuovi
                  </span>
                )}
              </div>
              <h3 className="text-zinc-500 text-sm font-medium">Fatturato Totale</h3>
              <p className="text-3xl font-bold mt-1">€{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
              </div>
              <h3 className="text-zinc-500 text-sm font-medium">Contenuti editoriali</h3>
              <p className="text-3xl font-bold mt-1">{articles.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <UsersIcon size={24} />
                </div>
              </div>
              <h3 className="text-zinc-500 text-sm font-medium">Utenti Registrati</h3>
              <p className="text-3xl font-bold mt-1">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <Mail size={24} />
                </div>
              </div>
              <h3 className="text-zinc-500 text-sm font-medium">Leads raccolti</h3>
              <p className="text-3xl font-bold mt-1">{leads.length}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold">
              {activeTab === 'overview'
                ? 'Panoramica Attività'
                : activeTab === 'pages'
                  ? 'Pagine e contenuti istituzionali'
                  : activeTab === 'articles'
                    ? 'Articoli Pubblicati'
                    : activeTab === 'products'
                      ? 'Prodotti nel Negozio'
                      : activeTab === 'orders'
                        ? 'Ordini Ricevuti'
                        : activeTab === 'users'
                          ? 'Utenti Registrati'
                          : activeTab === 'media'
                            ? 'Libreria Media'
                            : activeTab === 'analytics'
                              ? 'Analisi Vendite'
                              : 'Statistiche Collaborazioni'}
            </h2>
            {['articles', 'products', 'orders', 'users'].includes(activeTab) && (
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Cerca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                {['orders', 'leads'].includes(activeTab === 'overview' ? 'leads' : activeTab) && (
                  <button
                    onClick={handleExportCsv}
                    className="p-2 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:text-[var(--color-accent)] transition-colors"
                    title="Esporta CSV"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <ListSkeleton />
          ) : activeTab === 'overview' ? (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[var(--color-accent)]" />
                    Andamento Vendite
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9A7B4F" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#9A7B4F" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#888' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#888' }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#9A7B4F"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-[var(--color-accent)]" />
                    Ultimi Leads
                  </h3>
                  <div className="space-y-4">
                    {leads.slice(0, 5).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100"
                      >
                        <div>
                          <p className="font-medium">{lead.email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {lead.type && (
                              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                                {lead.type}
                              </span>
                            )}
                            {(lead.company || lead.topic) && (
                              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                {lead.company || lead.topic}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">
                            {(lead.createdAt as TimestampLike)?.toDate
                              ? (lead.createdAt as TimestampLike).toDate().toLocaleDateString()
                              : 'Recent'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <p className="text-zinc-500 text-center py-8">Nessun lead ancora ricevuto.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'media' ? (
            <MediaManager />
          ) : activeTab === 'pages' ? (
            <div className="p-8">
              <div className="mb-8 max-w-3xl">
                <p className="text-zinc-600">
                  Qui trovi gli editor guidati per le pagine istituzionali del sito.
                  L&rsquo;obiettivo è permetterti di aggiornare contenuti chiave senza toccare il
                  codice, mantenendo però struttura, stile e logica del progetto.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {siteContentDefinitions.map((page) => (
                  <div
                    key={page.id}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 shadow-sm"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--color-accent)] shadow-sm">
                      <Edit size={20} />
                    </div>
                    <h3 className="mb-3 text-xl font-serif">{page.title}</h3>
                    <p className="mb-6 min-h-[72px] text-sm leading-relaxed text-zinc-600">
                      {page.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/admin/site-content/${page.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                      >
                        <Edit size={14} /> Modifica
                      </Link>
                      <Link
                        to={page.previewPath}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 transition-colors hover:border-zinc-300"
                      >
                        <ArrowRight size={14} /> Anteprima
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'coupons' ? (
            <CouponManager />
          ) : activeTab === 'logs' ? (
            <AuditLog />
          ) : activeTab === 'orders' ? (
            <Orders />
          ) : activeTab === 'users' ? (
            <Users />
          ) : activeTab === 'analytics' ? (
            <div className="p-8 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#9A7B4F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : activeTab === 'stats' ? (
            <div className="p-8 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="igFollowers"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Follower Instagram
                  </label>
                  <input
                    id="igFollowers"
                    type="text"
                    value={stats.igFollowers}
                    onChange={(e) => setStats({ ...stats, igFollowers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="monthlyReach"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Copertura Mensile (Reach)
                  </label>
                  <input
                    id="monthlyReach"
                    type="text"
                    value={stats.monthlyReach}
                    onChange={(e) => setStats({ ...stats, monthlyReach: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="uniqueUsers"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Utenti Unici Mensili (Blog)
                  </label>
                  <input
                    id="uniqueUsers"
                    type="text"
                    value={stats.uniqueUsers}
                    onChange={(e) => setStats({ ...stats, uniqueUsers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="engagementRate"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Tasso di Engagement
                  </label>
                  <input
                    id="engagementRate"
                    type="text"
                    value={stats.engagementRate}
                    onChange={(e) => setStats({ ...stats, engagementRate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleSaveStats}
                  disabled={savingStats}
                  className="mt-8 bg-[var(--color-ink)] text-white px-8 py-4 rounded-xl font-medium hover:bg-[var(--color-ink)]/85 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {savingStats ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  Salva Statistiche
                </button>
              </div>
            </div>
          ) : activeTab === 'articles' ? (
            filteredArticles.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                Nessun contenuto editoriale trovato. Inizia a scrivere!
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-lg">{article.title}</h3>
                      <p className="text-sm text-zinc-500">{getPublicArticlePath(article)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                        {getPublicSectionLabel(getPublicArticleSection(article))}
                      </span>
                      {article.type === 'pillar' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-ink text-white">
                          Pillar
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${article.published ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {article.published ? 'Pubblicato' : 'Bozza'}
                      </span>
                      <Link
                        to={`/admin/editor/${article.id}`}
                        className="p-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              Nessun prodotto trovato. Aggiungi il tuo primo prodotto!
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-sm text-zinc-500">
                      /{product.slug} • €{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link
                      to={`/admin/product-editor/${product.id}`}
                      className="p-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
