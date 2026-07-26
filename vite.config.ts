import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'offline.html'],
        // Disable PWA service worker in dev so HMR-updated bundles never get
        // shadowed by a stale precache. Re-enabled automatically in build.
        disable: mode !== 'production',
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
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          // Esclude dal precache-install i reel video MP4 (~5-6 MB ciascuno) e i
          // chunk pesanti route-specific (mapbox-gl, recharts, react-quill editor,
          // @react-pdf/renderer). Questi ultimi sono hashati/immutabili e vengono
          // serviti on-demand al primo fetch via runtimeCaching CacheFirst,
          // togliendo ~3.7 MB dal manifest di install del service worker.
          globIgnores: [
            '**/video/**',
            '**/mapbox-*',
            // Il motore mappa vero è emesso come `maplibre-gl-*` (~1 MB): senza
            // questa riga finiva nel precache di install pur restando lazy.
            '**/maplibre-*',
            '**/charts-*',
            '**/editor-*',
            '**/react-pdf*',
            '**/three-*',
            '**/*-320.avif',
            '**/*-320.webp',
            '**/*-480.avif',
            '**/*-480.webp',
            '**/*-768.avif',
            '**/*-768.webp',
            '**/*-1024.avif',
            '**/*-1024.webp',
          ],
          runtimeCaching: [
            {
              urlPattern:
                /\/assets\/(mapbox|maplibre|charts|editor|react-pdf|three)[^/]*\.(?:js|css)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'heavy-route-chunks',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
          clientsClaim: true,
          skipWaiting: true,
          // Fix 2026-07-24 (gate S6): il fallback di navigazione DEVE essere
          // l'app shell, non la pagina offline. Con '/offline.html' la
          // NavigationRoute serviva "Sei offline" a OGNI hard-navigation
          // non-home dei visitatori di ritorno (/, unica eccezione, risolveva
          // via directoryIndex del precache). Una vera offline page richiede
          // un catchHandler (strategia injectManifest) — vedi
          // docs/50_Scratch/HANDOFF_gate-s6-perf_perf-engineer_to_frontend-builder.md.
          navigateFallback: '/index.html',
          // Don't redirect missing assets (with extension) to the app shell;
          // only redirect SPA navigations.
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        },
      }),
    ],
    // NOTE: rimosso `define` di GEMINI_API_KEY — la chiave non deve mai entrare
    // nel bundle client. La verifica AI passa ora attraverso l'endpoint server
    // admin-only `/api/admin/ai-verify` (vedi src/services/aiVerificationService.ts).
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      // R3F (@react-three/fiber) deve condividere LA STESSA copia di React del
      // resto dell'app, altrimenti CanvasImpl chiama gli hook su un React nullo
      // ("Invalid hook call" / "Cannot read properties of null (reading useMemo)").
      dedupe: ['react', 'react-dom', 'three'],
    },
    optimizeDeps: {
      // Pre-bundla lo stack 3D così il primo accesso a /sentiero non rompe il
      // dynamic import e React resta deduplicato dentro le deps ottimizzate.
      // react-map-gl/maplibre è nello stesso caso: scoperto tardi (lazy chunk
      // 'mapbox'), Vite lo ri-ottimizza a runtime e ricarica la pagina mentre
      // il componente Map è già montato, causando "Invalid hook call" /
      // "Cannot read properties of null (reading 'useContext')" su /mappa.
      include: [
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/postprocessing',
        'react-map-gl/maplibre',
        '@gsap/react',
        'gsap',
        'gsap/ScrollTrigger',
      ],
    },
    build: {
      // The Mapbox route is already lazy-loaded and split into its own vendor chunk.
      // Raise the heuristic threshold so production builds don't warn on that intentional isolation.
      chunkSizeWarningLimit: 1800,
      // Strip heavy route-specific chunks (mapbox, charts, editor) from the initial
      // modulepreload list so the home does not pull 1.7 MB of mapbox eagerly.
      // Lazy imports still fetch them on demand when the route mounts.
      modulePreload: {
        polyfill: true,
        resolveDependencies: (_filename, deps, { hostType }) => {
          if (hostType !== 'html') return deps;
          return deps.filter(
            (d) =>
              !d.includes('/mapbox-') &&
              !d.includes('/maplibre-') &&
              !d.includes('/charts-') &&
              !d.includes('/editor-') &&
              !d.includes('/maps-') &&
              !d.includes('/markdown-') &&
              !d.includes('/motion-') &&
              !d.includes('/three-')
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('vite/preload-helper')) {
              return 'vite-preload-helper';
            }

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

            // Stack 3D (three + R3F + drei + postprocessing + maath): chunk
            // dedicato, isolato dal vendor catch-all. La rotta /sentiero e gia
            // lazy, quindi questo chunk non entra nell'initial bundle ed e
            // tracciato dal budget `three-` in check-size.mjs. Regola PRIMA
            // delle euristiche loose (es. `motion`) per evitare cattura errata.
            if (
              id.includes('node_modules/three/') ||
              id.includes('node_modules/@react-three/') ||
              id.includes('node_modules/postprocessing/') ||
              id.includes('node_modules/maath/')
            ) {
              return 'three';
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

            if (id.includes('node_modules/gsap') || id.includes('@gsap/react')) {
              return 'gsap';
            }

            if (id.includes('node_modules/lenis')) {
              return 'lenis';
            }

            if (id.includes('embla-carousel')) {
              return 'embla';
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

            if (id.includes('fuse.js') || id.includes('react-error-boundary')) {
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
