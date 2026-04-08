import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { Plus, Trash2, Ticket, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { logActivity } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  description?: string;
  expiryDate?: { seconds: number; nanoseconds: number };
}

export default function CouponManager() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // New coupon form
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [newValue, setNewValue] = useState<number>(0);
  const [newExpiry, setNewExpiry] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      const fetched: Coupon[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        fetched.push({
          id: docSnap.id,
          code: typeof data.code === 'string' ? data.code : docSnap.id,
          type:
            data.type === 'fixed'
              ? 'fixed'
              : data.type === 'percent'
                ? 'percent'
                : data.discountType === 'fixed'
                  ? 'fixed'
                  : 'percent',
          value: typeof data.value === 'number' ? data.value : 0,
          active: data.active !== false,
          description: typeof data.description === 'string' ? data.description : undefined,
          expiryDate:
            data.expiryDate && typeof data.expiryDate === 'object'
              ? (data.expiryDate as { seconds: number; nanoseconds: number })
              : undefined,
        });
      });
      setCoupons(fetched);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAdding(true);
    try {
      const couponData = {
        code: newCode.toUpperCase(),
        type: newType,
        value: Number(newValue),
        active: true,
        description:
          newType === 'percent'
            ? `Sconto ${Number(newValue)}%`
            : `Sconto €${Number(newValue).toFixed(2)}`,
        expiryDate: newExpiry ? new Date(newExpiry) : null,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'coupons', newCode.toUpperCase()), couponData, { merge: true });
      await logActivity('Coupon Creato', user.email || 'Admin', `Codice: ${newCode.toUpperCase()}`);
      setNewCode('');
      setNewValue(0);
      setNewExpiry('');
      fetchCoupons();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'coupons');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!user || !window.confirm(`Sei sicuro di voler eliminare il coupon ${code}?`)) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      await logActivity('Coupon Eliminato', user.email || 'Admin', `Codice: ${code}`);
      fetchCoupons();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${id}`);
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-[var(--color-accent)]" /> Nuovo Coupon
            </h3>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label htmlFor="coupon-code" className="block text-sm font-medium mb-1">
                  Codice
                </label>
                <input
                  id="coupon-code"
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="ES: ESTATE20"
                  className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)] uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coupon-type" className="block text-sm font-medium mb-1">
                    Tipo
                  </label>
                  <select
                    id="coupon-type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'percent' | 'fixed')}
                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)] bg-white"
                  >
                    <option value="percent">% Percentuale</option>
                    <option value="fixed">€ Fisso</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="coupon-value" className="block text-sm font-medium mb-1">
                    Valore
                  </label>
                  <input
                    id="coupon-value"
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="coupon-expiry" className="block text-sm font-medium mb-1">
                  Scadenza (Opzionale)
                </label>
                <input
                  id="coupon-expiry"
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-[var(--color-ink)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50"
              >
                {adding ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Crea Coupon'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
              </div>
            ) : coupons.length === 0 ? (
              <p className="text-zinc-500 text-center py-12">Nessun coupon attivo.</p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white p-5 rounded-2xl border border-zinc-100 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 text-zinc-400 rounded-xl">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg tracking-wider">{coupon.code}</span>
                        {coupon.active ? (
                          <CheckCircle2 size={16} className="text-[var(--color-accent)]" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-500">
                        Sconto:{' '}
                        {coupon.type === 'percent'
                          ? `${coupon.value}%`
                          : `€${coupon.value.toFixed(2)}`}
                        {coupon.expiryDate &&
                          ` • Scade il: ${new Date(coupon.expiryDate.seconds * 1000).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
