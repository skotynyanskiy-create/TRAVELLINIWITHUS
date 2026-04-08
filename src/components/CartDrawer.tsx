import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, CheckCircle, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface AppliedCoupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    total,
    clearCart,
    getCheckoutItems,
  } = useCart();
  const { user } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? total * (appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, total)
    : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = (await response.json()) as {
        valid: boolean;
        code?: string;
        type?: string;
        value?: number;
        description?: string;
        error?: string;
      };
      if (data.valid && data.code && data.type && data.value !== undefined) {
        setAppliedCoupon({
          code: data.code,
          type: data.type as 'percent' | 'fixed',
          value: data.value,
          description: data.description || '',
        });
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Codice non valido.');
      }
    } catch {
      setCouponError('Errore di connessione. Riprova.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: getCheckoutItems(),
          couponCode: appliedCoupon?.code,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        if (data.mock) {
          // In preview without Stripe keys, simulate success
          setShowCheckoutModal(true);
        } else {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        }
      } else {
        throw new Error(data.error || 'Errore durante il checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Si e verificato un errore durante il checkout. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCheckout = () => {
    setShowCheckoutModal(false);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-110 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrello"
            className="fixed top-0 right-0 bottom-0 z-120 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 p-6">
              <h2 className="flex items-center gap-2 text-xl font-serif">
                <ShoppingBag size={20} className="text-accent" />
                Il tuo carrello
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-zinc-100"
                aria-label="Chiudi carrello"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center space-y-4 text-zinc-500"
                >
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Il tuo carrello e vuoto</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-sm font-semibold uppercase tracking-widest text-accent hover:underline"
                  >
                    Continua lo shopping
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="flex gap-4"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="line-clamp-1 font-semibold text-zinc-900">
                              {item.name}
                            </h3>
                            <p className="font-medium text-accent">EUR {item.price.toFixed(2)}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            {!item.isDigital ? (
                              <div className="flex items-center overflow-hidden rounded-md border border-zinc-200">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 transition-colors hover:bg-zinc-100 active:bg-zinc-200"
                                  aria-label={`Riduci quantita di ${item.name}`}
                                >
                                  -
                                </button>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="min-w-8 px-2 text-center text-sm font-medium"
                                >
                                  {item.quantity}
                                </motion.span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 transition-colors hover:bg-zinc-100 active:bg-zinc-200"
                                  aria-label={`Aumenta quantita di ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-accent bg-sand rounded-md">
                                Content Digitale
                              </div>
                            )}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-zinc-400 transition-colors hover:text-red-500"
                              aria-label={`Rimuovi ${item.name} dal carrello`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-zinc-100 bg-zinc-50 p-6 space-y-4"
              >
                {/* Coupon input */}
                {!appliedCoupon ? (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Codice sconto"
                          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Applica'}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[var(--color-accent)]" />
                      <span className="text-sm font-semibold text-[var(--color-accent-text)]">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs text-[var(--color-accent)]">
                        {appliedCoupon.description}
                      </span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                      aria-label="Rimuovi coupon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2">
                  {appliedCoupon && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Subtotale</span>
                        <span className="text-zinc-700">EUR {total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-accent)]">
                          Sconto ({appliedCoupon.code})
                        </span>
                        <span className="font-medium text-[var(--color-accent)]">
                          - EUR {discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Totale</span>
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.1, color: '#f59e0b' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      className="text-2xl font-serif font-semibold"
                    >
                      EUR {finalTotal.toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-accent hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Elaborazione...
                    </>
                  ) : (
                    'Procedi al checkout'
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {showCheckoutModal && (
              <div className="fixed inset-0 z-130 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setShowCheckoutModal(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Conferma checkout"
                  className="relative z-140 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
                    <CheckCircle className="text-[var(--color-accent)]" size={32} />
                  </div>
                  <h3 className="mb-2 text-2xl font-serif text-zinc-900">Ordine completato</h3>
                  <p className="mb-8 text-zinc-600">
                    Questa e una simulazione di acquisto. Grazie per aver provato lo shop di
                    Travelliniwithus.
                  </p>
                  <button
                    onClick={confirmCheckout}
                    className="w-full rounded-xl bg-accent py-3 font-semibold text-white transition-colors hover:bg-opacity-90"
                  >
                    Torna allo shop
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
