import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseDb';
import { Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import ListSkeleton from '../../components/ListSkeleton';

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: unknown;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo ordine?")) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-serif mb-8">Gestione Ordini</h2>
      {loading ? (
        <ListSkeleton />
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">Nessun ordine trovato.</div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {orders.map(order => (
            <div key={order.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{order.customerName}</h3>
                <p className="text-sm text-zinc-500">{order.email}</p>
                <p className="text-xs text-zinc-400 mt-1">ID: {order.id}</p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="block font-semibold text-lg">€{order.total.toFixed(2)}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== 'completed' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="p-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
                      title="Segna come completato"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      title="Annulla ordine"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                  {order.status !== 'pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      className="p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
                      title="Riporta in sospeso"
                    >
                      <Clock size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 transition-colors ml-2"
                    title="Elimina ordine"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
