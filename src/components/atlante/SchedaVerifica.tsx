import { PARTNERSHIP_LABEL } from '../../types/content';
import type { ContentItem } from '../../types/content';
import { getReelForPosto } from '../../config/reels';
import { meseAnno } from '../../utils/format';

/**
 * Le righe della "scheda di verifica" di un posto — il retro della carta.
 *
 * Ogni riga mostra solo dati reali. **Nessun verdetto**: qui c'era una riga
 * «Verdetto» che su tutte e 29 le schede diceva «In arrivo», perche' il voto e'
 * vuoto ovunque e per scelta editoriale resta vuoto — il mestiere e' spiegare
 * il posto, non dargli un numero. Una riga che promette un giudizio che non
 * arrivera' mai occupa il posto di un'informazione vera, e questa scheda sta
 * anche in cima a ogni pagina-posto e nell'hero della home.
 *
 * Al suo posto ci sono i dati che esistono davvero su 29 schede su 29: che
 * tipo di posto e', quando ci siamo stati, e a che titolo ci siamo andati.
 */
export default function SchedaVerifica({ item }: { item: ContentItem }) {
  const dove = [item.place.name, [item.place.city, item.place.region].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' — ');
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const review = item.review;
  const cosaE = (item.types ?? []).join(' · ');
  // La data del reel e' la data della visita: e' l'unica cronologia che il
  // progetto ha, ed e' popolata su tutte le schede reali.
  const quando = meseAnno(getReelForPosto(item.id)?.publishedAt);

  return (
    <dl className="atlante-scheda">
      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Dove</dt>
        <dd className="atlante-scheda__value">{dove}</dd>
      </div>

      {cosaE && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Cos&apos;è</dt>
          <dd className="atlante-scheda__value">{cosaE}</dd>
        </div>
      )}

      {quando && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Ci siamo stati</dt>
          <dd className="atlante-scheda__value">{quando}</dd>
        </div>
      )}

      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Prezzo</dt>
        <dd className="atlante-scheda__value">
          {item.value?.price ? (
            <>
              <strong>{item.value.price}</strong>
              {item.value.budget ? ` · budget ${item.value.budget.toLowerCase()}` : null}
            </>
          ) : item.value?.budget ? (
            // Meglio la fascia del nulla: due schede hanno solo questa.
            <>
              Budget <strong>{item.value.budget.toLowerCase()}</strong>
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
