export interface PressMention {
  outlet: string;
  date: string;
  title: string;
  url: string;
  quote?: string;
  logo?: string;
  language?: string;
}

/**
 * Menzioni stampa Travelliniwithus.
 * Aggiornare quando arrivano citazioni reali da testate. Niente menzioni
 * inventate: meglio un array vuoto e una sezione che dice esplicitamente
 * "stiamo costruendo" piuttosto che social proof falso.
 */
export const PRESS_MENTIONS: PressMention[] = [];
