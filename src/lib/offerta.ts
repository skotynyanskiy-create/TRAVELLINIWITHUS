/**
 * Un'offerta è attiva quando esiste **e** non è scaduta.
 *
 * Le due condizioni vivevano separate, e la separazione era un difetto in
 * attesa: `getFamilyDeals()` contava su `Boolean(item.deal)`, mentre `DealCard`
 * sapeva già riconoscere le scadute e non le renderizzava. Il giorno della
 * prima scadenza la home avrebbe detto «2 codici attivi» sopra uno scaffale
 * vuoto — un numero vero che descrive una pagina che non c'è.
 *
 * Non è un caso ipotetico: l'edizione family sta per ricevere i suoi primi
 * codici, e `validUntil` è obbligatorio nel modello. Il difetto sarebbe nato
 * col primo codice e si sarebbe manifestato mesi dopo, quando nessuno lo
 * collega più a questa riga.
 */

/**
 * Il confronto sta a **fine giornata** (`23:59:59` locale): una promo «valida
 * fino al 31 dicembre» vale per tutto il 31, non fino alla sua mezzanotte
 * iniziale.
 *
 * Una data illeggibile **non** nasconde l'offerta: davanti a un dato rotto si
 * sbaglia mostrando, non sopprimendo — così il difetto si vede e si corregge,
 * invece di far sparire un'offerta vera in silenzio.
 */
export function offertaScaduta(validUntil: string | undefined): boolean {
  if (!validUntil) return false;
  const fine = new Date(validUntil);
  if (Number.isNaN(fine.getTime())) return false;
  fine.setHours(23, 59, 59, 999);
  return fine.getTime() < Date.now();
}

/** L'offerta esiste ed è ancora valida: l'unica condizione da contare. */
export function offertaAttiva(deal: { validUntil?: string } | undefined | null): boolean {
  return Boolean(deal) && !offertaScaduta(deal?.validUntil);
}
