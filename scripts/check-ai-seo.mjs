import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const llmsPath = path.join(rootDir, 'public', 'llms.txt');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');

console.log('AI-SEO & GEO (Generative Engine Optimization) Audit');

let failed = false;

// 1. Verify llms.txt
if (!fs.existsSync(llmsPath)) {
  console.error('FAIL public/llms.txt is missing.');
  failed = true;
} else {
  const content = fs.readFileSync(llmsPath, 'utf8');
  if (!content.includes('Rodrigo') || !content.includes('Betta')) {
    console.error('FAIL public/llms.txt missing author entity declarations.');
    failed = true;
  } else if (!content.includes('https://travelliniwithus.it')) {
    console.error('FAIL public/llms.txt missing canonical domain declaration.');
    failed = true;
  } else {
    console.log('PASS public/llms.txt is valid, structured, and entity-rich.');
  }
}

// 2. Verify sitemap.xml
if (!fs.existsSync(sitemapPath)) {
  console.error('WARN public/sitemap.xml missing (built during npm run build).');
} else {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  if (!content.includes('urlset') && !content.includes('sitemapindex')) {
    console.error('FAIL public/sitemap.xml invalid format.');
    failed = true;
  } else {
    console.log('PASS public/sitemap.xml format is valid.');
  }
}

// 3. Verify robots.txt
if (!fs.existsSync(robotsPath)) {
  console.error('FAIL public/robots.txt is missing.');
  failed = true;
} else {
  const content = fs.readFileSync(robotsPath, 'utf8');
  if (!content.includes('User-agent')) {
    console.error('FAIL public/robots.txt missing User-agent declarations.');
    failed = true;
  } else {
    console.log('PASS public/robots.txt is valid.');
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\nPASS AI-SEO & GEO audit passed cleanly.');
}
