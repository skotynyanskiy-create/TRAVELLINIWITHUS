import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (cfg) => {
    // The app's vite.config (tailwind, alias '@') is merged in automatically.
    // Strip vite-plugin-pwa: it serves no purpose in Storybook and its
    // production build step injects a service worker that breaks build-storybook.
    cfg.plugins = (cfg.plugins ?? []).flat(Infinity).filter((p) => {
      const name = (p as { name?: string } | null | undefined)?.name ?? '';
      return !name.includes('pwa') && !name.includes('workbox');
    });
    return cfg;
  },
};

export default config;
