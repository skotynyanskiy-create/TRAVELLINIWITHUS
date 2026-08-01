/**
 * Decide quali etichette disegnare sulla mappa e quali no.
 *
 * Il difetto da risolvere e' visibile a occhio: con 62 posti di cui una
 * ventina fra Lombardia, Veneto ed Emilia, a zoom basso le pillole coi nomi si
 * accavallano in un muro illeggibile.
 *
 * La strada scartata era raggrupparli in un badge col numero: risolve la
 * collisione ma butta via il nome, che e' la cosa che rende quella mappa
 * riconoscibile. Un cerchio con scritto "17" e' una libreria di clustering
 * qualunque; "The Burton Juice" no.
 *
 * Quindi: **nessun pin sparisce e nessun numero compare**. Si disegna
 * l'etichetta a chi ha spazio, in ordine di importanza; a chi non ne ha resta
 * il punto. Zoomando lo spazio cresce e i nomi ricompaiono da soli — e' il
 * comportamento delle mappe vere, dove le etichette appaiono per rilevanza.
 *
 * Il calcolo e' in **spazio schermo**: due posti a dieci chilometri si toccano
 * a zoom 5 e non si toccano a zoom 12, quindi conta la distanza in pixel dopo
 * la proiezione. Chi chiama proietta con `map.project()`; qui dentro non si sa
 * nulla di mappe, ed e' il motivo per cui questa funzione si testa da sola.
 */

export interface LabelCandidate<T> {
  item: T;
  /** Ascissa in pixel dopo la proiezione. */
  x: number;
  /** Ordinata in pixel dopo la proiezione. */
  y: number;
  /** Chi vince quando due etichette si contendono lo spazio: piu' alto, prima.
   *  Serve un criterio stabile, o l'etichetta lampeggia mentre si trascina. */
  priority: number;
  /** Larghezza stimata dell'etichetta: un nome lungo occupa piu' spazio. */
  width: number;
}

export interface LabelPlacement<T> {
  /** Chi ha trovato spazio e mostra il nome. */
  labelled: T[];
  /** Chi resta come punto: presente, cliccabile, senza nome. */
  dots: T[];
}

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function overlaps(a: Box, b: Box): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/**
 * @param candidates punti gia' proiettati in pixel
 * @param labelHeight altezza della pillola in pixel, uguale per tutte
 * @param padding respiro minimo fra due etichette
 */
export function placeLabels<T>(
  candidates: LabelCandidate<T>[],
  labelHeight: number,
  padding = 6
): LabelPlacement<T> {
  // Ordine deterministico: priorita' decrescente, poi posizione. Senza il
  // secondo criterio due punti di pari priorita' si scambiano il posto a ogni
  // ricalcolo e le etichette sfarfallano.
  const ordered = [...candidates].sort((a, b) => b.priority - a.priority || a.y - b.y || a.x - b.x);

  const placed: Box[] = [];
  const labelled: T[] = [];
  const dots: T[] = [];

  for (const candidate of ordered) {
    const halfWidth = candidate.width / 2;
    const box: Box = {
      left: candidate.x - halfWidth - padding,
      right: candidate.x + halfWidth + padding,
      top: candidate.y - labelHeight - padding,
      bottom: candidate.y + padding,
    };

    if (placed.some((other) => overlaps(box, other))) {
      dots.push(candidate.item);
    } else {
      placed.push(box);
      labelled.push(candidate.item);
    }
  }

  return { labelled, dots };
}
