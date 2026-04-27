export interface NewsletterIssue {
  number: number;
  date: string; // ISO YYYY-MM-DD
  title: string;
  summary: string;
  topics: string[];
  webViewUrl?: string;
}

/**
 * Archivio numeri precedenti della newsletter Travelliniwithus.
 * Vuoto inizialmente: la pagina /newsletter mostra empty state finche'
 * non viene pubblicato il primo numero. Aggiornare manualmente dopo ogni invio.
 */
export const NEWSLETTER_ARCHIVE: NewsletterIssue[] = [];
