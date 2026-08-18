import React, { useState } from 'react';
import { Navigation, Loader2, X } from 'lucide-react';
import { trackEvent } from '@/src/services/analytics';

interface NearMeFilterButtonProps {
  onLocationFound: (coords: { lat: number; lng: number } | null) => void;
  activeCoords: { lat: number; lng: number } | null;
  className?: string;
}

export const NearMeFilterButton: React.FC<NearMeFilterButtonProps> = ({
  onLocationFound,
  activeCoords,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestLocation = () => {
    if (activeCoords) {
      onLocationFound(null);
      setErrorMsg(null);
      trackEvent('near_me_filter_clear');
      return;
    }

    if (!navigator.geolocation) {
      setErrorMsg('Geolocalizzazione non supportata dal tuo browser');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onLocationFound(coords);
        trackEvent('near_me_filter_activate', {
          lat: coords.lat,
          lng: coords.lng,
        });
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Attiva i permessi di posizione nel tuo browser');
        } else {
          setErrorMsg('Impossibile rilevare la posizione attuale');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      {/* Token brand, non amber/stone: era l'unico controllo del sito con
          una palette propria — e le varianti dark: scattavano col tema OS
          scuro, su un sito che il dark mode non ce l'ha. */}
      <button
        type="button"
        onClick={handleRequestLocation}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm ${
          activeCoords
            ? 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent-hover)]'
            : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]'
        }`}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin text-[var(--color-accent-text)]" />
        ) : (
          <Navigation size={14} className={activeCoords ? 'fill-current' : ''} />
        )}
        <span>{activeCoords ? 'Vicino a me (attivo)' : 'Vicino a me'}</span>
        {activeCoords && <X size={13} className="ml-1" />}
      </button>

      {errorMsg && (
        <span className="text-[11px] font-medium text-[var(--color-error)]">{errorMsg}</span>
      )}
    </div>
  );
};
