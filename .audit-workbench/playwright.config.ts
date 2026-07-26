import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  testMatch: '**/*.spec.ts',
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    trace: 'on',
  },
  reporter: [['line'], ['html', { outputFolder: 'playwright-report-audit' }]],
});
