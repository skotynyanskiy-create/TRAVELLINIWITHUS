import { PARTNERSHIP_LABEL } from '../../types/content';
import type { ContentItem } from '../../types/content';
import { getReelForPosto } from '../../config/reels';
import { meseAnno } from '../../utils/format';

/**
 * Le righe della "scheda di verifica" di un posto — il retro della carta.
 *
 * **Qui non si giudica: si descrive.** Il sito dice cos'e' un posto e cosa serve
 * sapere per andarci; se valga il viaggio lo decide chi legge. Per questo la
 * scheda non ha voti, non ha una riga «Verdetto» e non ha «per chi si' / per chi
 * no»: tutte e tre sono passate di qui e tutte e tre sono state tolte, l'ultima
 * il 2026-08-15 su decisione dell'owner.
 *
 * Ogni riga mostra solo dati reali, e una riga assente e' uno stato legittimo:
 * meglio niente che un dato stimato. Questa scheda sta in cima a ogni
 * pagina-posto e nell'hero della home, quindi un campo inventato qui si vede
 * ovunque.
 *
 * **Cosa NON va qui: le informazioni per pianificare** — come ci arrivi, quanto
 * ci stai, quando andarci, cosa sapere prima. Stanno in `PrimaDiAndare`
 * (`src/components/posto/PrimaDiAndare.tsx`), nel corpo della pagina. Qui erano
 * arrivate per un'ora il 2026-08-15 e la faccia della carta, che ha altezza
 * fissa, e' passata a scrollare per il doppio di se stessa su mobile. Questa
 * carta risponde a una domanda sola: «esiste davvero?».
 */
export default function SchedaVerifica({ item }: { item: ContentItem }) {
  const dove = [item.place.name, [item.place.city, item.place.region].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' — ');
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];
  const pratico = item.practical;
  const cosaE = (item.types ?? []).join(' · ');
  // Quando ci siamo stati. `practical.visitedAt` e' il dato vero e vince su
  // tutto; senza, si ripiega sulla data del reel, che e' un'approssimazione —
  // dice quando e' uscito il video, non quando ci si e' andati. Il manifest dei
  // reel viene prima dell'item perche' i posti importati senza video in locale
  // non hanno entry li' e la riga sparirebbe pur essendo il dato sull'item.
  const quando = meseAnno(
    pratico?.visitedAt ?? getReelForPosto(item.id)?.publishedAt ?? item.publishedAt
  );

  return (
    <dl className="atlante-scheda">
      <div className="atlante-scheda__row">
        <dt className="atlante-scheda__label">Dove</dt>
        <dd className="atlante-scheda__value">{dove}</dd>
      </div>

      {item.place.address && (
        <div className="atlante-scheda__row">
          <dt className="atlante-scheda__label">Indirizzo</dt>
          <dd className="atlante-scheda__value">{item.place.address}</dd>
        </div>
      )}

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
