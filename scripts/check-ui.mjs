import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const extensions = new Set(['.tsx']);
const ignoredFiles = new Set([
  path.join(srcDir, 'config', 'site.ts'),
  path.join(srcDir, 'components', 'SEO.tsx'),
]);
const inlineStyleAllowlist = [
  'src/components/AffiliateBox.tsx',
  'src/components/CrossLinkWidget.tsx',
  'src/components/InteractiveMap.tsx',
  'src/components/Layout.tsx',
  'src/components/article/ArticleHero.tsx',
  'src/components/home/DestinationsGrid.tsx',
  'src/components/home/HeroSection.tsx',
  'src/pages/Articolo.tsx',
  'src/pages/Contatti.tsx',
  'src/pages/Destinazioni.tsx',
  'src/pages/Esperienze.tsx',
  'src/pages/Guide.tsx',
  'src/pages/Shop.tsx',
];
const rawColorAllowlist = [
  'src/components/AffiliateBox.tsx',
  'src/components/Button.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/CrossLinkWidget.tsx',
  'src/components/EmptyState.tsx',
  'src/components/Footer.tsx',
  'src/components/InteractiveMap.tsx',
  'src/components/SEOPreview.tsx',
  'src/components/article/AuthorBio.tsx',
  'src/components/article/SocialFollowCTA.tsx',
  'src/components/home/AboutPreview.tsx',
  'src/components/home/CommunitySection.tsx',
  'src/components/home/DestinationsGrid.tsx',
  'src/components/home/HeroSection.tsx',
  'src/pages/Articolo.tsx',
  'src/pages/ChiSiamo.tsx',
  'src/pages/Collaborazioni.tsx',
  'src/pages/Contatti.tsx',
  'src/pages/Mappa.tsx',
  'src/pages/ProductPage.tsx',
  'src/pages/Risorse.tsx',
  'src/pages/Shop.tsx',
  'src/pages/admin/AdminDashboard.tsx',
];
const semanticPaletteAllowlist = [
  'src/components/CartDrawer.tsx',
  'src/components/CouponManager.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/InlineNewsletterBanner.tsx',
  'src/components/MediaManager.tsx',
  'src/components/Navbar.tsx',
  'src/components/Newsletter.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/pages/Club.tsx',
  'src/pages/Contatti.tsx',
  'src/pages/Guide.tsx',
  'src/pages/MediaKit.tsx',
  'src/pages/MieiAcquisti.tsx',
  'src/pages/Shop.tsx',
  'src/pages/admin/AdminDashboard.tsx',
  'src/pages/admin/ArticleEditor.tsx',
  'src/pages/admin/Orders.tsx',
  'src/pages/admin/SiteContentEditor.tsx',
  'src/pages/admin/Users.tsx',
];

function isAllowlisted(filePath, allowlist) {
  const relativePath = path.relative(rootDir, filePath).replaceAll('\\', '/');
  return allowlist.includes(relativePath);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['config', 'services', 'lib', 'test'].includes(entry.name)) {
        continue;
      }
      files.push(...walk(fullPath));
      continue;
    }

    if (!extensions.has(path.extname(entry.name))) {
      continue;
    }

    if (entry.name.endsWith('.test.tsx') || entry.name.endsWith('.test.ts')) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function pushIssue(issues, level, filePath, line, message) {
  issues.push({
    level,
    filePath: path.relative(rootDir, filePath),
    line,
    message,
  });
}

/**
 * Token CSS dichiarati: `--x:` in un qualsiasi CSS del progetto, piu' quelli
 * impostati inline da JSX (`style={{ '--x': ... }}`), che sono definizioni a
 * tutti gli effetti.
 */
function collectDefinedTokens() {
  const defined = new Set();
  const cssFiles = [path.join(rootDir, 'index.html')];
  const stack = [srcDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name.endsWith('.css')) cssFiles.push(full);
    }
  }
  for (const file of cssFiles) {
    if (!fs.existsSync(file)) continue;
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
      defined.add(m[1]);
    }
  }
  for (const file of walk(srcDir)) {
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/['"`](--[a-zA-Z0-9_-]+)['"`]\s*:/g)) {
      defined.add(m[1]);
    }
  }
  return defined;
}

const definedTokens = collectDefinedTokens();

/**
 * Una `var(--x)` che punta a un token inesistente non fa rumore: la CSS resta
 * valida, typecheck non entra nelle stringhe di classe e axe non se ne accorge.
 * Ma dentro un valore arbitrario Tailwind (`shadow-[var(--x)]`) invalida
 * l'INTERA proprieta' — ed e' cosi' che `--shadow-soft` ha spento per mesi il
 * focus ring di ContentCard (audit 2026-08-02). Senza fallback e' un errore;
 * con fallback degrada e resta solo codice morto da togliere.
 */
function checkTokenReferences(issues, filePath, content) {
  for (const match of content.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,?)/g)) {
    const [, token, comma] = match;
    if (token.startsWith('--tw-') || definedTokens.has(token)) continue;
    const hasFallback = comma === ',';
    pushIssue(
      issues,
      hasFallback ? 'warn' : 'error',
      filePath,
      getLineNumber(content, match.index),
      hasFallback
        ? `CSS variable "${token}" is never defined; only the fallback ever applies. Remove the dead token reference.`
        : `CSS variable "${token}" is never defined and has no fallback. Inside an arbitrary value this invalidates the whole declaration.`
    );
  }
}

const files = walk(srcDir);
const issues = [];

for (const filePath of files) {
  if (ignoredFiles.has(filePath)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (!isAllowlisted(filePath, inlineStyleAllowlist)) {
    const inlineStyleMatches = [...content.matchAll(/style=\{\{/g)];
    for (const match of inlineStyleMatches) {
      pushIssue(issues, 'warn', filePath, getLineNumber(content, match.index), 'Inline style found in JSX. Confirm it is required for animation, transforms or third-party APIs.');
    }
  }

  if (!isAllowlisted(filePath, rawColorAllowlist)) {
    const rawColorMatches = [...content.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)];
    for (const match of rawColorMatches) {
      pushIssue(issues, 'warn', filePath, getLineNumber(content, match.index), `Raw color token "${match[0]}" found. Confirm it is intentional and not a missed brand token.`);
    }
  }

  if (!isAllowlisted(filePath, semanticPaletteAllowlist)) {
    const paletteMatches = [...content.matchAll(/\b(?:bg|text|border|fill|stroke|from|via|to|ring)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g)];
    for (const match of paletteMatches) {
      pushIssue(
        issues,
        'warn',
        filePath,
        getLineNumber(content, match.index),
        `Non-brand Tailwind palette class "${match[0]}" found. Confirm it is semantic UI, not brand styling.`
      );
    }
  }

  checkTokenReferences(issues, filePath, content);

  const imgMatches = [...content.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)];
  for (const match of imgMatches) {
    pushIssue(issues, 'error', filePath, getLineNumber(content, match.index), '<img> without alt attribute found.');
  }

  const iconLibraryMatches = [...content.matchAll(/from ['"]([^'"]+)['"]/g)];
  for (const match of iconLibraryMatches) {
    const source = match[1];
    if (source === 'lucide-react') {
      continue;
    }

    if (source.includes('react-icons') || source.includes('heroicons') || source.includes('phosphor')) {
      pushIssue(
        issues,
        'warn',
        filePath,
        getLineNumber(content, match.index),
        `Alternative icon library import "${source}" found.`
      );
    }
  }
}

const errorCount = issues.filter((issue) => issue.level === 'error').length;
const warnCount = issues.filter((issue) => issue.level === 'warn').length;
const maxPrintedIssues = 80;

console.log('UI audit');
console.log(`Files scanned: ${files.length}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warnCount}`);

const printedIssues = [...issues].sort((a, b) => Number(b.level === 'error') - Number(a.level === 'error'));

for (const issue of printedIssues.slice(0, maxPrintedIssues)) {
  const prefix = issue.level.toUpperCase().padEnd(5, ' ');
  console.log(`${prefix} ${issue.filePath}:${issue.line} - ${issue.message}`);
}

if (issues.length > maxPrintedIssues) {
  console.log(`WARN  ${issues.length - maxPrintedIssues} additional findings omitted from console output.`);
}

if (issues.length === 0) {
  console.log('PASS  No UI consistency issues detected by static heuristics.');
}

process.exitCode = errorCount > 0 ? 1 : 0;
