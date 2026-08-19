import { createRequire } from 'node:module';

import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeScriptPath = require.resolve('axe-core/axe.min.js');
const baseUrl = process.env.A11Y_BASE_URL ?? 'http://localhost:3000';
const routes = ['/', '/collaborazioni', '/media-kit', '/chi-siamo'];
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa'];
const maxNodesPerViolation = 3;

function formatNode(node) {
  const summary = node.failureSummary?.replaceAll(/\s+/g, ' ').trim();
  return `${node.target.join(' ')}${summary ? ` — ${summary}` : ''}`;
}

function printViolations(route, violations) {
  console.log(`FAIL  ${route}: ${violations.length} rule violation(s)`);

  for (const violation of violations) {
    console.log(`  ${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`);
    for (const node of violation.nodes.slice(0, maxNodesPerViolation)) {
      console.log(`    ${formatNode(node)}`);
    }
    if (violation.nodes.length > maxNodesPerViolation) {
      console.log(`    … ${violation.nodes.length - maxNodesPerViolation} additional node(s)`);
    }
  }
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let violationCount = 0;
  let routeFailureCount = 0;

  try {
    for (const route of routes) {
      const url = new URL(route, baseUrl).href;

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (!response || !response.ok()) {
          throw new Error(`received HTTP ${response?.status() ?? 'no response'}`);
        }

        // Consent and audience dialogs mount shortly after hydration, while the
        // hero finishes its entrance animation. Audit the settled initial UI,
        // rather than an intermediate animation frame with reduced opacity.
        await page.waitForTimeout(3_000);
        await page.addScriptTag({ path: axeScriptPath });
        const result = await page.evaluate(
          async (tags) =>
            window.axe.run(document, {
              runOnly: { type: 'tag', values: tags },
            }),
          wcagTags
        );

        if (result.violations.length === 0) {
          console.log(`PASS  ${route}: 0 violations`);
          continue;
        }

        violationCount += result.violations.length;
        printViolations(route, result.violations);
      } catch (error) {
        routeFailureCount += 1;
        console.log(`FAIL  ${route}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`\nAccessibility audit: ${routes.length} route(s), ${violationCount} violation(s)`);

  if (routeFailureCount > 0) {
    console.log(`Route failures: ${routeFailureCount}`);
  }

  process.exitCode = violationCount > 0 || routeFailureCount > 0 ? 1 : 0;
}

runAudit().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
