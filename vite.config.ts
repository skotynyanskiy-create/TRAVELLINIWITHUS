import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Travelliniwithus',
          short_name: 'Travellini',
          description: 'Travel blog di Rodrigo & Betta',
          theme_color: '#ffffff',
          background_color: '#f9f9f8',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      // The Mapbox route is already lazy-loaded and split into its own vendor chunk.
      // Raise the heuristic threshold so production builds don't warn on that intentional isolation.
      chunkSizeWarningLimit: 1800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            const packagePath = id.split('node_modules/')[1] ?? id;

            if (
              packagePath.startsWith('react/') ||
              packagePath.startsWith('react-dom/') ||
              packagePath.startsWith('scheduler/') ||
              packagePath.startsWith('react-is/') ||
              packagePath.startsWith('react-router/') ||
              packagePath.startsWith('react-router-dom/') ||
              packagePath.startsWith('@tanstack/react-query/') ||
              packagePath.startsWith('react-helmet-async/')
            ) {
              return 'react-core';
            }

            if (id.includes('firebase')) {
              if (id.includes('firestore')) {
                return 'firebase-firestore';
              }

              if (id.includes('auth')) {
                return 'firebase-auth';
              }

              if (id.includes('storage')) {
                return 'firebase-storage';
              }

              return 'firebase-core';
            }

            if (id.includes('motion') || id.includes('framer-motion')) {
              return 'motion';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('recharts')) {
              return 'charts';
            }

            if (id.includes('react-simple-maps')) {
              return 'maps';
            }

            if (id.includes('react-map-gl') || id.includes('mapbox-gl')) {
              return 'mapbox';
            }

            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown';
            }

            if (id.includes('react-quill-new')) {
              return 'editor';
            }

            if (id.includes('fuse.js') || id.includes('react-intersection-observer') || id.includes('react-error-boundary')) {
              return 'search-utils';
            }

            if (id.includes('@google/genai') || id.includes('@stripe/stripe-js')) {
              return 'integrations';
            }

            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
