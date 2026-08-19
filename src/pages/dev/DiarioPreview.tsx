import { Helmet } from 'react-helmet-async';
import DiarioMasterpieceHome from '@/src/components/home/diario/DiarioMasterpieceHome';

/**
 * Pagina dev-only per l'anteprima isolata della nuova Homepage Capolavoro
 * "Il Diario dell'Atlante Vivo". Non indicizzabile, non presente nel build di produzione.
 */
export default function DiarioPreview() {
  return (
    <>
      <Helmet>
        <title>Anteprima Nuova Home Capolavoro | Travelliniwithus Dev</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-[var(--color-ink-deep)] py-2 text-center text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        ✦ Anteprima Dev — Nuova Homepage "Il Diario dell'Atlante Vivo"
      </div>

      <DiarioMasterpieceHome />
    </>
  );
}
