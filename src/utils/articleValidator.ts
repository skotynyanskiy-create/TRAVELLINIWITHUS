import type { NormalizedArticle } from './articleData';

/**
 * Livello di severità per un check: `error` blocca la pubblicazione,
 * `warning` resta pubblicabile ma va corretto in un secondo tempo.
 */
export type ArticleIssueSeverity = 'error' | 'warning';

export interface ArticleIssue {
  severity: ArticleIssueSeverity;
  field: keyof NormalizedArticle | 'seo' | 'content' | 'media';
  message: string;
  /** Hint breve su come sistemare (mostrato all'autore in UI). */
  hint?: string;
}

export interface ArticleValidationReport {
  ok: boolean;
  issues: ArticleIssue[];
  stats: {
    wordCount: number;
    headingCount: number;
    imageCount: number;
    hasHero: boolean;
  };
}

const MIN_TITLE_LEN = 20;
const MAX_TITLE_LEN = 75;
const MIN_DESCRIPTION_LEN = 80;
const MAX_DESCRIPTION_LEN = 170;
const MIN_CONTENT_WORDS = 600;
const MIN_CONTENT_WORDS_PILLAR = 1500;
const MIN_HEADINGS = 3;
const MIN_HEADINGS_PILLAR = 5;

function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

function countMarkdownHeadings(content: string): number {
  const markdownMatches = content.match(/^(#{1,6})\s+/gm)?.length ?? 0;
  const htmlMatches = content.match(/<h[1-6][\s>]/gi)?.length ?? 0;
  return markdownMatches + htmlMatches;
}

function countImages(content: string): number {
  const markdownMatches = content.match(/!\[[^\]]*\]\([^)]+\)/g)?.length ?? 0;
  const htmlMatches = content.match(/<img\s/gi)?.length ?? 0;
  return markdownMatches + htmlMatches;
}

/**
 * Esegue una batteria di check editoriali. Usa i risultati per:
 *   1. bloccare publish nel ArticleEditor admin
 *   2. esporre un audit CLI (`scripts/check-articles.mjs`) in predeploy
 */
export function validateArticle(article: Partial<NormalizedArticle>): ArticleValidationReport {
  const issues: ArticleIssue[] = [];

  const title = article.title?.trim() ?? '';
  if (!title) {
    issues.push({ severity: 'error', field: 'title', message: 'Titolo mancante' });
  } else if (title.length < MIN_TITLE_LEN) {
    issues.push({
      severity: 'warning',
      field: 'title',
      message: `Titolo troppo corto (${title.length} car., min ${MIN_TITLE_LEN})`,
      hint: 'Aggiungi specificità: luogo, taglio editoriale, beneficio per il lettore.',
    });
  } else if (title.length > MAX_TITLE_LEN) {
    issues.push({
      severity: 'warning',
      field: 'title',
      message: `Titolo troppo lungo (${title.length} car., max ${MAX_TITLE_LEN})`,
      hint: 'Google tronca i titoli SERP oltre 60-70 caratteri.',
    });
  }

  const slug = article.slug?.trim() ?? '';
  if (!slug) {
    issues.push({ severity: 'error', field: 'slug', message: 'Slug mancante' });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    issues.push({
      severity: 'error',
      field: 'slug',
      message: 'Slug non kebab-case (lowercase, trattini)',
      hint: 'Converti in minuscolo, sostituisci spazi con "-", rimuovi accenti.',
    });
  }

  const excerpt = article.excerpt?.trim() ?? '';
  const description = article.description?.trim() ?? '';
  const metaDescription = description || excerpt;
  if (!metaDescription) {
    issues.push({
      severity: 'error',
      field: 'seo',
      message: 'Meta description ed excerpt vuoti',
      hint: 'Senza description il snippet Google viene generato in modo imprevedibile.',
    });
  } else if (metaDescription.length < MIN_DESCRIPTION_LEN) {
    issues.push({
      severity: 'warning',
      field: 'seo',
      message: `Meta description corta (${metaDescription.length} car., min ${MIN_DESCRIPTION_LEN})`,
    });
  } else if (metaDescription.length > MAX_DESCRIPTION_LEN) {
    issues.push({
      severity: 'warning',
      field: 'seo',
      message: `Meta description lunga (${metaDescription.length} car., max ${MAX_DESCRIPTION_LEN})`,
    });
  }

  const content = article.content?.trim() ?? '';
  const wordCount = countWords(content);
  const headingCount = countMarkdownHeadings(content);
  const imageCount = countImages(content);
  const isPillar = article.type === 'pillar';
  const minWords = isPillar ? MIN_CONTENT_WORDS_PILLAR : MIN_CONTENT_WORDS;
  const minHeadings = isPillar ? MIN_HEADINGS_PILLAR : MIN_HEADINGS;

  if (!content) {
    issues.push({ severity: 'error', field: 'content', message: 'Corpo articolo vuoto' });
  } else if (wordCount < minWords) {
    issues.push({
      severity: 'warning',
      field: 'content',
      message: `Contenuto breve (${wordCount} parole, target min ${minWords}${isPillar ? ' per una pillar guide' : ''})`,
      hint: isPillar
        ? 'Le pillar guide sono risorse lunghe e complete: servono sezioni When, Where to stay, What to eat, Budget, Itinerary.'
        : 'Gli articoli Travellini puntano a valore esperienziale, non al minimo SEO.',
    });
  }

  if (content && headingCount < minHeadings) {
    issues.push({
      severity: 'warning',
      field: 'content',
      message: `Solo ${headingCount} heading (target min ${minHeadings}${isPillar ? ' per pillar' : ''})`,
      hint: 'Struttura con H2/H3: lettura scannabile e opportunità per featured snippet.',
    });
  }

  if (isPillar) {
    if (!article.hotels || article.hotels.length === 0) {
      issues.push({
        severity: 'error',
        field: 'content',
        message: 'Pillar senza hotel consigliati',
        hint: 'Una guida completa deve includere almeno 2-3 hotel curati con priceHint e rating.',
      });
    }

    if (!article.shopCta) {
      issues.push({
        severity: 'warning',
        field: 'content',
        message: 'Pillar senza Shop CTA',
        hint: 'Collega un prodotto shop (Google Maps, preset o ebook) per monetizzare il traffico pillar.',
      });
    }
  }

  const cover = article.coverImage?.trim() || article.image?.trim() || '';
  if (!cover) {
    issues.push({
      severity: 'error',
      field: 'media',
      message: 'Cover image mancante',
      hint: 'OG image + LCP dipendono dalla hero: carica una foto reale 1600x900 min.',
    });
  }

  const category = article.category?.trim() ?? '';
  if (!category) {
    issues.push({ severity: 'warning', field: 'category', message: 'Categoria non impostata' });
  }

  const author = article.author?.trim() ?? '';
  if (!author) {
    issues.push({
      severity: 'warning',
      field: 'author',
      message: 'Autore non indicato',
      hint: 'E-E-A-T: senza author byline Google fatica a stabilire expertise.',
    });
  }

  if (!article.disclosureType) {
    issues.push({
      severity: 'error',
      field: 'disclosureType',
      message: 'Disclosure editoriale non impostata',
      hint: 'Indica se il viaggio e personale, ospitato, pagato o con affiliazioni.',
    });
  }

  if (!article.verifiedAt) {
    issues.push({
      severity: 'error',
      field: 'verifiedAt',
      message: 'Data verifica mancante',
      hint: 'Compila l ultima data in cui il contenuto e stato verificato sul campo o aggiornato.',
    });
  }

  if (!article.budgetBand) {
    issues.push({
      severity: 'warning',
      field: 'budgetBand',
      message: 'Fascia budget non impostata',
      hint: 'Serve per rendere piu leggibile l archivio e i box decisionali.',
    });
  }

  if (!article.tripIntents?.length) {
    issues.push({
      severity: 'warning',
      field: 'tripIntents',
      message: 'Intenti di viaggio non compilati',
      hint: 'Seleziona 1-3 intenti per collegare meglio articolo, home e hub discovery.',
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
    stats: {
      wordCount,
      headingCount,
      imageCount,
      hasHero: cover.length > 0,
    },
  };
}

/**
 * Helper per UI admin: raggruppa gli issue per severità e restituisce
 * un flag `canPublish` pronto da bindare al bottone.
 */
export function summarizeValidation(report: ArticleValidationReport) {
  const errors = report.issues.filter((issue) => issue.severity === 'error');
  const warnings = report.issues.filter((issue) => issue.severity === 'warning');
  return {
    canPublish: errors.length === 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings,
    stats: report.stats,
  };
}
