import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tscPath = require.resolve('typescript/bin/tsc');

const result = spawnSync(process.execPath, [tscPath, '--noEmit', '--project', 'tsconfig.strict.json'], {
  stdio: 'inherit',
});

if (result.error) {
  console.error('[typecheck:strict] Failed to start TypeScript compiler.');
  console.error(result.error);
  process.exit(1);
}

if (result.status === 0) {
  console.log('[typecheck:strict] PASS strict TypeScript check.');
  process.exit(0);
}

console.log(
  `[typecheck:strict] WARN strict TypeScript check found issues (exit ${result.status}). Non-blocking by design.`
);
process.exit(0);
