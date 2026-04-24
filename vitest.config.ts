import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    // Workaround Vitest 4.1.0 su Windows: file-level parallelism causa
    // race condition sui worker globals ("Cannot read properties of
    // undefined (reading 'config')"). Test sequenziali ~35s vs ~20s
    // teorici — trade-off accettabile per stabilità.
    fileParallelism: false,
  },
});
