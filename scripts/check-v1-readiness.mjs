import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
let failed = false;

const readText = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');

const pass = (message) => {
  console.log(`PASS ${message}`);
};

const fail = (message) => {
  failed = true;
  console.log(`FAIL ${message}`);
};

const warn = (message) => {
  console.log(`WARN ${message}`);
};

const fileExists = (relativePath) => fs.existsSync(path.join(rootDir, relativePath));

console.log('== V1 readiness guard ==');

if (fileExists('public/sitemap.xml')) {
  const sitemap = readText('public/sitemap.xml');
  const queryParamUrls = [...sitemap.matchAll(/<loc>[^<]*\?[^<]*<\/loc>/g)].map(
    (match) => match[0],
  );

  if (queryParamUrls.length > 0) {
    fail(`Sitemap contiene URL con query param: ${queryParamUrls.slice(0, 5).join(', ')}`);
  } else {
    pass('Sitemap senza URL con query param.');
  }
} else {
  warn('public/sitemap.xml mancante: esegui npm run build prima del gate V1.');
}

if (fileExists('public/robots.txt')) {
  const robots = readText('public/robots.txt');
  const shopDisallowed = /Disallow:\s*\/shop\b/.test(robots);

  if (!shopDisallowed && process.env.V1_SHOP_PUBLIC !== 'true') {
    fail('/shop risulta indicizzabile senza V1_SHOP_PUBLIC=true.');
  } else if (shopDisallowed) {
    pass('/shop resta noindex/disallow finche il prodotto non e vendibile.');
  } else {
    pass('/shop indicizzabile per override esplicito V1_SHOP_PUBLIC=true.');
  }
} else {
  warn('public/robots.txt mancante: impossibile verificare il gate shop.');
}

const partnerLogos = readText('src/components/home/PartnerLogos.tsx');
const blockedPartnerNames = [
  'Visit Sardegna',
  'Pugliapromozione',
  'ENIT',
  'Visit Grecia',
  'Hotel Villa Dei Sogni',
];
const leakedPartners = blockedPartnerNames.filter((name) => partnerLogos.includes(name));

if (leakedPartners.length > 0) {
  fail(`PartnerLogos contiene proof non verificata: ${leakedPartners.join(', ')}`);
} else {
  pass('Nessun logo partner fallback hardcoded in PartnerLogos.');
}

const demoContent = readText('src/config/demoContent.ts');
if (/reviews\s*:/.test(demoContent)) {
  fail('demoContent contiene recensioni demo: rimuoverle prima della release pubblica.');
} else {
  pass('Nessuna recensione demo nel catalogo fallback.');
}

const mediaKitGenerator = readText('scripts/generate-media-kit.tsx');
if (mediaKitGenerator.includes('BRAND_STATS')) {
  fail('Il media kit generator usa ancora BRAND_STATS come fallback pubblico.');
} else {
  pass('Media kit senza fallback numerici non verificati.');
}

const shopPage = readText('src/pages/Shop.tsx');
if (!shopPage.includes('downloadUrl')) {
  fail('Shop.tsx non controlla downloadUrl per la acquistabilita dei prodotti digitali.');
} else {
  pass('Shop controlla la consegna digitale prima di abilitare acquisto.');
}

const productPage = readText('src/pages/ProductPage.tsx');
if (!productPage.includes('isPurchasable')) {
  fail('ProductPage.tsx non espone un gate isPurchasable per schema/checkout.');
} else {
  pass('Product page separa prodotto draft da prodotto acquistabile.');
}

process.exitCode = failed ? 1 : 0;
