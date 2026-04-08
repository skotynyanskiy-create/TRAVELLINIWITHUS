import fs from 'node:fs';
import path from 'node:path';

const [, , rawPageName, rawRouteName] = process.argv;

if (!rawPageName) {
  console.error('Usage: npm run scaffold:page -- PageName optional-route-slug');
  process.exit(1);
}

const pageName = rawPageName.replace(/[^A-Za-z0-9]/g, '');

if (!pageName) {
  console.error('Page name must contain letters or numbers.');
  process.exit(1);
}

const routeName =
  rawRouteName ||
  pageName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const rootDir = process.cwd();
const pagePath = path.join(rootDir, 'src', 'pages', `${pageName}.tsx`);

if (fs.existsSync(pagePath)) {
  console.error(`Page already exists: ${path.relative(rootDir, pagePath)}`);
  process.exit(1);
}

const componentSource = `import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

export default function ${pageName}() {
  return (
    <PageLayout>
      <SEO
        title='${pageName}'
        description='Descrizione da completare per la pagina ${pageName}.'
        canonical={\`\${SITE_URL}/${routeName}\`}
      />

      <Section className='pt-8'>
        <div className='max-w-3xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]'>
            Eyebrow
          </p>
          <h1 className='mt-4 text-4xl font-serif text-[var(--color-ink)] md:text-6xl'>
            ${pageName}
          </h1>
          <p className='mt-6 text-lg leading-relaxed text-black/70'>
            Contenuto iniziale da sostituire.
          </p>
        </div>
      </Section>
    </PageLayout>
  );
}
`;

fs.writeFileSync(pagePath, componentSource, 'utf8');

console.log(`Created ${path.relative(rootDir, pagePath)}`);
console.log('Next steps:');
console.log(`1. Add lazy import in src/App.tsx: const ${pageName} = lazy(() => import('./pages/${pageName}'));`);
console.log(`2. Add route in src/App.tsx: <Route path="${routeName}" element={<${pageName} />} />`);
console.log(`3. Add navigation entry if the page is public.`);
console.log('4. Update scripts/generate-sitemap.js if the page is static and public.');
