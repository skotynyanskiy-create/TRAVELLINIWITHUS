import fs from 'node:fs';
import path from 'node:path';
import { caricaSeed, leggiSchedaConLegacy, schedaPath } from './lib/verdetti.mjs';

const root = process.cwd();
const outPath = schedaPath(root);

// Rigenerare NON deve cancellare quello che l'owner ha gia' scritto: prima di
// riscrivere si rilegge la scheda esistente (e quella col nome vecchio) e i
// campi compilati vengono riportati dentro. Senza questo, aggiungere schede al
// seed distruggeva il lavoro fatto sulle precedenti.
const giaScritti = leggiSchedaConLegacy(root);

const items = (caricaSeed(root).items ?? []).filter((item) => item.isPlaceholder !== true);

// I posti senza relazione commerciale vengono per primi: sono i più liberi da
// scrivere e servono a calibrare la voce prima di affrontare quelli ospitati.
const RELATION_ORDER = ['organic', 'invited', 'collaboration', 'affiliate', 'adv'];

const RELATION_LABEL = {
  organic: 'nessuna relazione — ci siete andati a spese vostre',
  invited: 'vi hanno ospitati',
  collaboration: 'collaborazione',
  affiliate: 'affiliazione',
  adv: 'contenuto a pagamento (adv)',
};

function relationLine(partnership) {
  const kind = partnership?.kind ?? 'organic';
  const label = RELATION_LABEL[kind] ?? kind;
  const partner = partnership?.partner ? ` · ${partnership.partner}` : '';
  const flag = kind === 'organic' ? '' : ' — **il limite onesto qui pesa di più**';
  return `${label}${partner}${flag}`;
}

function whereLine(place) {
  if (!place) return '—';
  const parts = [place.name, place.city, place.region, place.country].filter(Boolean);
  const seen = [];
  for (const part of parts) if (!seen.includes(part)) seen.push(part);
  return seen.join(' — ');
}

items.sort((a, b) => {
  const ra = RELATION_ORDER.indexOf(a.partnership?.kind ?? 'organic');
  const rb = RELATION_ORDER.indexOf(b.partnership?.kind ?? 'organic');
  if (ra !== rb) return ra - rb;
  return (a.title ?? '').localeCompare(b.title ?? '', 'it');
});

const blocks = items.map((item, index) => {
  const n = String(index + 1).padStart(2, '0');
  const scritto = giaScritti[item.id] ?? {};
  // Quello che l'owner ha scritto batte il seed; il seed batte il vuoto.
  const price = scritto.price ?? item.value?.price;
  const budget = scritto.budget ?? item.value?.budget;

  const facts = [
    `- **Dove:** ${whereLine(item.place)}`,
    `- **Categorie:** ${(item.types ?? []).join(' · ') || '—'}`,
    `- **Il vostro hook:** «${item.hook ?? '—'}»`,
    `- **Relazione:** ${relationLine(item.partnership)}`,
    `- **Reel:** ${item.permalink ?? '—'}`,
    `- \`id: ${item.id}\``,
  ].join('\n');

  const priceField = price
    ? `**Prezzo reale:** ${price}\n*(già noto — correggilo solo se sbagliato)*`
    : '**Prezzo reale:**';
  const budgetField = budget
    ? `**Fascia:** ${budget}\n*(già nota — correggila solo se sbagliata)*`
    : '**Fascia:** Economico / Medio / Alto → *lascia solo quella giusta*';

  const verdetto = scritto.verdict ?? item.review?.verdict ?? '';
  const nonFaPerTe = scritto.notForWho ?? item.review?.notForWho ?? '';
  const perChi =
    scritto.forWho ??
    item.review?.forWho ??
    'coppia / famiglia / gruppo / da-soli → *lascia solo quelli giusti*';

  return `### ${n} · ${item.title ?? item.id}

${facts}

**Verdetto:** ${verdetto}

**Non fa per te se:** ${nonFaPerTe}

**Per chi:** ${perChi}

${priceField}

${budgetField}

---`;
});

const compilati = items.filter((item) => {
  const s = giaScritti[item.id] ?? {};
  return (s.forWho ?? item.review?.forWho) && (s.notForWho ?? item.review?.notForWho);
}).length;

const counts = items.reduce((acc, item) => {
  const kind = item.partnership?.kind ?? 'organic';
  acc[kind] = (acc[kind] ?? 0) + 1;
  return acc;
}, {});
const countLine = RELATION_ORDER.filter((kind) => counts[kind])
  .map((kind) => `${counts[kind]} ${kind}`)
  .join(' · ');

const header = `---
type: scratch
area: content
status: active
created: 2026-07-26
related: '[[PROJECT_ELEVAZIONE_TOTALE_2026-07]]'
tags:
  - content
  - verdetti
  - posti
---

# I ${items.length} verdetti — scheda di compilazione

Ogni posto reale del sito ha bisogno di tre cose scritte da voi. I fatti sono
già compilati: nome, luogo, categoria, hook, relazione, prezzo dove noto.
Voi aggiungete solo il giudizio.

Ordine: ${countLine}. I posti senza relazione commerciale vengono per primi,
perché sono i più liberi da scrivere e servono a calibrare la voce.

## Come si compila

- **Verdetto** — una riga, la vostra voce. È il giudizio, non la descrizione:
  il posto è già descritto altrove. Es. «Ci si va per il tramonto, non per la cucina.»
- **Non fa per te se** — una riga, il limite onesto. **Obbligatorio.** Con
  ${counts.organic ?? 0} posti su ${items.length} visitati senza relazione commerciale, questo
  campo è l'unica cosa che rende credibile tutto il resto. Se su un posto che vi
  ha ospitati non riuscite a scrivere un limite vero, è un segnale: quel verdetto
  non è pronto.
- **Per chi** — cancellate le voci che non valgono. Serve a filtrare il sito,
  quindi non lasciatele tutte per sicurezza.
- **Prezzo e fascia** — solo se li ricordate davvero. Meglio vuoto che inventato.

Niente voti, niente stelle: la decisione del 2026-07-26 è che il sito giudica
l'adeguatezza, non il merito.

## La forma, in un esempio

Questo viene dalla scheda placeholder «The Burton Juice» — non è un verdetto
approvato e non so chi l'abbia scritto. Serve solo a mostrare la lunghezza e il
taglio giusti:

> **Per chi:** Coppie e gruppi di amici cresciuti con l'immaginario di Tim Burton,
> che da una cena vogliono soprattutto il ricordo.
>
> **Non fa per te se:** Chi cerca una cena tranquilla e silenziosa: la scena è
> ovunque e gli attori arrivano al tavolo.

---

`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + blocks.join('\n\n') + '\n', 'utf8');
console.log(`Scheda generata: ${path.relative(root, outPath)}`);
console.log(`Posti: ${items.length} (${countLine})`);
console.log(`Gia' compilati (per-chi + non-fa-per-te): ${compilati} su ${items.length}`);
if (Object.keys(giaScritti).length > 0) {
  console.log(`Conservati dalla scheda precedente: ${Object.keys(giaScritti).length} posti`);
}
console.log('Per riportarli nel seed: npm run verdetti:applica -- --commit');
