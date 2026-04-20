import { motion } from 'motion/react';
import {
  ShoppingBag,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, type Order } from '../services/firebaseService';

const statusConfig = {
  completed: {
    label: 'Completato',
    icon: CheckCircle,
    color: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent-soft)]',
    border: 'border-[var(--color-accent)]/20',
  },
  pending: {
    label: 'In attesa',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  cancelled: {
    label: 'Annullato',
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  const date = (() => {
    if (!order.createdAt) return '—';
    try {
      const ts = order.createdAt as { toDate?: () => Date; seconds?: number };
      const d = ts.toDate
        ? ts.toDate()
        : ts.seconds
          ? new Date(ts.seconds * 1000)
          : new Date(order.createdAt as string);
      return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return '—';
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/30 mb-1">
              <Calendar size={12} />
              {date}
            </div>
            <h3 className="font-serif text-xl">
              {order.items && order.items.length > 0
                ? order.items.map((i) => i.name).join(', ')
                : 'Ordine #' + order.id.slice(-6).toUpperCase()}
            </h3>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${status.bg} ${status.border} ${status.color}`}
          >
            <StatusIcon size={14} />
            {status.label}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-black/30 block mb-1">
              Totale
            </span>
            <span className="text-xl font-serif">EUR {order.total.toFixed(2)}</span>
          </div>

          {order.status === 'completed' && (
            <div className="flex gap-3">
              {order.items
                ?.map((item) => item as { downloadUrl?: string; id: string; name: string })
                .filter((i) => (i as { downloadUrl?: string }).downloadUrl)
                .map((item) => {
                  const downloadItem = item as { downloadUrl: string; name: string; id: string };
                  return (
                    <a
                      key={downloadItem.id}
                      href={downloadItem.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)] transition-colors px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
                    >
                      <Download size={14} />
                      Scarica
                    </a>
                  );
                })}
              {(!order.items ||
                order.items.every((i) => !(i as { downloadUrl?: string }).downloadUrl)) && (
                <Link
                  to="/contatti"
                  className="inline-flex items-center gap-2 border border-black/10 hover:border-[var(--color-accent)] text-black/60 hover:text-[var(--color-accent)] transition-all px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
                >
                  <ExternalLink size={14} />
                  Richiedi accesso
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MieiAcquisti() {
  const { user, loading: authLoading, signIn } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['userOrders', user?.uid, user?.email],
    queryFn: async () => {
      if (!user?.uid && !user?.email) return [];
      return fetchUserOrders({ uid: user?.uid, email: user?.email });
    },
    enabled: (!!user?.uid || !!user?.email) && !authLoading,
  });

  return (
    <PageLayout>
      <SEO
        title="I miei acquisti"
        description="Visualizza e scarica i tuoi contenuti premium acquistati su Travelliniwithus."
        noindex
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-24 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-[var(--color-accent)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-accent)]">
              Account
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-4">I miei acquisti</h1>
          <p className="text-black/60 font-light text-lg">
            Qui trovi tutti i contenuti premium che hai acquistato.
          </p>
        </motion.div>

        {authLoading || isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] border border-black/5 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : !user ? (
          <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center">
            <Package size={48} className="mx-auto mb-6 text-black/20" />
            <h2 className="font-serif text-2xl mb-4">Accedi per vedere i tuoi acquisti</h2>
            <p className="text-black/60 font-light mb-8">
              Effettua l'accesso con lo stesso account usato al momento dell'acquisto.
            </p>
            <button
              type="button"
              onClick={() => { void signIn(); }}
              className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)] transition-colors px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest"
            >
              Accedi con Google
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-6 text-black/20" />
            <h2 className="font-serif text-2xl mb-4">Nessun acquisto ancora</h2>
            <p className="text-black/60 font-light mb-8">
              Non hai ancora effettuato acquisti. Esplora il nostro shop per trovare guide e
              contenuti premium.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] hover:opacity-90 transition-opacity px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest"
            >
              Vai allo shop
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-black/40 font-medium mb-2">
              {orders.length} {orders.length === 1 ? 'ordine' : 'ordini'}
            </p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
