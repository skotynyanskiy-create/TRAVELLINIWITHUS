/**
 * Pubblica un seed articolo su Firestore. Dry-run per default.
 *
 *   npm run publish:article -- <slug>                       # mostra cosa scriverebbe
 *   npm run publish:article -- <slug> --commit              # scrive, published invariato
 *   npm run publish:article -- <slug> --commit --publish    # scrive e mette online
 *
 * PERCHE' ESISTE, invece di usare /admin/editor:
 * il campo `partnership` (disclosure AGCOM/IAP) e' letto da
 * normalizeFirestoreArticle e renderizzato da ArticleHero, ma NON e' fra i
 * campi ammessi da `isValidArticle()` in firestore.rules, e ArticleEditor non
 * lo invia. Nessuna scrittura client puo' quindi pubblicare un articolo con la
 * dicitura "ADV". Questo script usa l'Admin SDK, che le rules non filtrano.
 *
 * Conseguenza da tenere a mente: qui NON c'e' rete di sicurezza lato database.
 * Le validazioni sotto sono l'unico controllo, e sono deliberatamente severe:
 * lo script si rifiuta di pubblicare un abbozzo.
 */
import fs from 'node:fs';
import path from 'node:path';

const PLACEHOLDER_MARKERS = [
  'PLACEHOLDER',
  '[SEZIONE',
  'in arrivo.',
  'Da verificare sul posto',
  '[VERIFY',
];

const PLACEHOLDER_COVERS = ['/hero-adventure.jpg', '/images/reels/reel-placeholder.webp'];

const EXCERPT_MAX = 160;

/** Campi ammessi da isValidArticle() in firestore.rules. */
const RULES_ALLOWED_FIELDS = new Set([
  'title',
  'slug',
  'excerpt',
  'content',
  'coverImage',
  'category',
  'author',
  'location',
  'country',
  'region',
  'city',
  'continent',
  'experienceTypes',
  'period',
  'budget',
  'readTime',
  'tips',
  'packingList',
  'highlights',
  'mapUrl',
  'duration',
  'videoUrl',
  'published',
  'authorId',
  'createdAt',
  'updatedAt',
]);

function parseArgs(argv) {
  const positional = argv.filter((a) => !a.startsWith('--'));
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  return {
    slug: positional[0],
    commit: flags.has('--commit'),
    publish: flags.has('--publish'),
  };
}

function fail(message) {
  console.error(`\n  ERRORE  ${message}\n`);
  process.exit(1);
}

/**
 * Il documento Firestore non ha la stessa forma del seed: `destination`
 * diventa `location`, `author` da oggetto diventa stringa, `tags` e `featured`
 * non esistono a database. Mapparlo a mano invece di fare uno spread e' il
 * punto: uno spread avrebbe scritto campi che le rules rifiutano.
 */
function toFirestoreDocument(seed, { authorId, publish, now }) {
  return {
    title: seed.title,
    slug: seed.slug,
    excerpt: seed.excerpt,
    content: seed.content,
    coverImage: seed.coverImage,
    category: seed.category,
    author: seed.author.name,
    location: seed.destination,
    published: publish ? true : Boolean(seed.published),
    authorId,
    createdAt: now,
    updatedAt: now,
    // Fuori dal contratto delle rules — vedi intestazione del file.
    partnership: seed.partnership,
    ...(seed.imageAlt ? { imageAlt: seed.imageAlt } : {}),
    ...(seed.ogImage ? { ogImage: seed.ogImage } : {}),
  };
}

function validate(seed, { publish }) {
  const problems = [];

  if (!seed.slug) problems.push('slug mancante');
  if (!seed.title) problems.push('title mancante');
  if (!seed.content) problems.push('content mancante');

  if (seed.excerpt && seed.excerpt.length > EXCERPT_MAX) {
    problems.push(`excerpt di ${seed.excerpt.length} caratteri, il massimo e' ${EXCERPT_MAX}`);
  }

  // Le validazioni che seguono contano solo se l'articolo va online: un seed
  // puo' legittimamente restare a database con published:false mentre si lavora.
  if (!publish) return problems;

  for (const field of ['excerpt', 'content', 'title']) {
    const marker = PLACEHOLDER_MARKERS.find((m) => (seed[field] || '').includes(m));
    if (marker) problems.push(`${field} contiene ancora un segnaposto: "${marker}"`);
  }

  if (PLACEHOLDER_COVERS.includes(seed.coverImage)) {
    problems.push(`coverImage e' ancora il placeholder ${seed.coverImage}`);
  }

  if (!seed.tags || seed.tags.length === 0) {
    problems.push('tags vuoto');
  }

  return problems;
}

async function main() {
  const { slug, commit, publish } = parseArgs(process.argv.slice(2));

  if (!slug) {
    fail('Manca lo slug. Uso: npm run publish:article -- <slug> [--commit] [--publish]');
  }

  const seedPath = path.join(process.cwd(), 'src', 'data', 'articles', `${slug}.seed.ts`);
  if (!fs.existsSync(seedPath)) fail(`Seed non trovato: ${seedPath}`);

  const { articleSeed: seed } = await import(`file://${seedPath.replace(/\\/g, '/')}`);

  const problems = validate(seed, { publish });
  if (problems.length > 0) {
    console.error(`\n  ${slug} non e' pubblicabile:`);
    for (const p of problems) console.error(`   - ${p}`);
    console.error('\n  Nessuna scrittura eseguita.\n');
    process.exit(1);
  }

  const authorId = process.env.ARTICLE_AUTHOR_UID;
  if (commit && !authorId) {
    fail(
      "ARTICLE_AUTHOR_UID non impostata. E' lo UID Firebase Auth dell'owner: le rules " +
        'richiedono authorId == request.auth.uid, e va rispettato anche scrivendo da Admin SDK.'
    );
  }

  const doc = toFirestoreDocument(seed, {
    authorId: authorId || '<ARTICLE_AUTHOR_UID>',
    publish,
    now: '<serverTimestamp>',
  });

  const outsideRules = Object.keys(doc).filter((k) => !RULES_ALLOWED_FIELDS.has(k));

  console.log(`\n  articles/${slug}`);
  console.log(`  published : ${doc.published}`);
  console.log(`  location  : ${doc.location}`);
  console.log(`  author    : ${doc.author}`);
  console.log(`  excerpt   : ${doc.excerpt.length} caratteri`);
  console.log(`  content   : ${doc.content.split(/\s+/).length} parole`);
  console.log(`  cover     : ${doc.coverImage}`);
  if (doc.imageAlt) console.log(`  cover alt : ${doc.imageAlt}`);
  if (doc.ogImage) console.log(`  og image  : ${doc.ogImage}`);
  console.log(
    `  disclosure: ${doc.partnership.kind}${doc.partnership.partner ? ` — ${doc.partnership.partner}` : ''}`
  );

  if (outsideRules.length > 0) {
    console.log(
      `\n  Nota: ${outsideRules.join(', ')} non e' fra i campi ammessi da firestore.rules.\n` +
        "  Passa solo perche l'Admin SDK non e' soggetto alle rules."
    );
  }

  if (!commit) {
    console.log('\n  DRY-RUN — nessuna scrittura. Aggiungi --commit per scrivere davvero.\n');
    return;
  }

  const credential =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!credential) {
    fail('FIREBASE_SERVICE_ACCOUNT_JSON non impostata: impossibile scrivere su Firestore.');
  }

  const databaseId =
    process.env.FIRESTORE_DATABASE_ID ||
    JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'))
      .firestoreDatabaseId;
  if (!databaseId) fail('Database Firestore non risolto.');

  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getFirestore, FieldValue } = await import('firebase-admin/firestore');

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(
        credential.trim().startsWith('{')
          ? JSON.parse(credential)
          : JSON.parse(fs.readFileSync(credential, 'utf8'))
      ),
    });
  }

  const db = getFirestore(databaseId);
  const ref = db.collection('articles').doc(slug);
  const existing = await ref.get();

  await ref.set(
    {
      ...doc,
      authorId,
      createdAt: existing.exists ? existing.data().createdAt : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(
    `\n  Scritto su ${databaseId}/articles/${slug} (${existing.exists ? 'aggiornato' : 'creato'}).`
  );
  console.log('  Ricorda: `npm run build` per rigenerare sitemap e pre-render.\n');
}

main().catch((error) => fail(error?.message || String(error)));
