import VerdictSeal from '../VerdictSeal';
import { PARTNERSHIP_LABEL } from '../../types/content';
import type { ContentItem } from '../../types/content';

/**
 * Le righe della "scheda di verifica" di un posto — il retro della carta.
 * Ogni riga mostra solo dati reali; dove il dato manca la scheda dichiara
 * onestamente che arriva dopo la verifica: il metodo È la promessa.
 */
export default function SchedaVerifica({ item }: { item: ContentItem }) {
  const dove = [item.place.name, [item.place.city, item.place.region].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' — ');
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const review = item.review;

  return (
    <dl className="atlante-scheda">
      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Dove</dt>
        <dd className="atlante-scheda__value">{dove}</dd>
      </div>

      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Prezzo</dt>
        <dd className="atlante-scheda__value">
          {item.value?.price ? (
            <>
              <strong>{item.value.price}</strong>
              {item.value.budget ? ` · budget ${item.value.budget.toLowerCase()}` : null}
            </>
          ) : (
            <span className="atlante-scheda__pending">
              In arrivo — lo pubblichiamo solo verificato fino all&apos;ultimo euro.
            </span>
          )}
        </dd>
      </div>

      {review?.forWho && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Per chi è</dt>
          <dd className="atlante-scheda__value">{review.forWho}</dd>
        </div>
      )}

      {review?.notForWho && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Per chi no</dt>
          <dd className="atlante-scheda__value">{review.notForWho}</dd>
        </div>
      )}

      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Verdetto</dt>
        <dd className="atlante-scheda__value">
          {review?.overall != null ? (
            <span className="flex items-center gap-3">
              <VerdictSeal overall={review.overall} size="md" />
              {review.verdict && <span>{review.verdict}</span>}
            </span>
          ) : (
            <span className="atlante-scheda__pending">
              In arrivo — solo quando l&apos;abbiamo verificato fino in fondo.
            </span>
          )}
        </dd>
      </div>

      {partnerLabel && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Trasparenza</dt>
          <dd className="atlante-scheda__value">
            {partnerLabel}
            {item.partnership.partner ? ` · ${item.partnership.partner}` : ''}
          </dd>
        </div>
      )}
    </dl>
  );
}
