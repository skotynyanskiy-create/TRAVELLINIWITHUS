#!/usr/bin/env node
/**
 * Cross-platform launcher for the Python hooks.
 *
 * The hooks were declared as `py <script>`. `py` is the Windows Python launcher
 * and does not exist on Linux or macOS, so on a cloud sandbox or a CI runner
 * they did not fail loudly — they simply never fired, and config_protection.py
 * stopped guarding firestore.rules and src/config/admin.ts exactly where the
 * session had the least oversight.
 *
 * Interpreter choice must NOT use a PATH lookup: Windows ships `python3` and
 * `python` as App Execution Aliases that resolve on PATH but exit 49 with a
 * "install from the Microsoft Store" message. Every candidate is therefore
 * probed with --version and accepted only on exit 0.
 *
 * stdio is inherited so the hook payload on stdin reaches Python untouched and
 * exit code 2 (block + feed stderr to the model) survives.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [script, ...rest] = process.argv.slice(2);
if (!script) process.exit(0);

const target = join(dirname(fileURLToPath(import.meta.url)), script);
const candidates = process.platform === 'win32' ? ['py', 'python3', 'python'] : ['python3', 'python'];

for (const bin of candidates) {
  const probe = spawnSync(bin, ['--version'], { stdio: 'ignore' });
  if (probe.error || probe.status !== 0) continue;
  const run = spawnSync(bin, [target, ...rest], { stdio: 'inherit' });
  process.exit(run.status ?? 0);
}

// Fail open, but loudly. Failing closed would block every Edit and Bash call on
// a machine without Python and leave no way out from inside the session. Exit 0
// keeps work flowing; the message makes the missing guard visible instead of
// silent — the silence was the actual bug.
process.stderr.write(
  `[hooks] nessun interprete Python funzionante (provati: ${candidates.join(', ')}) — ` +
    `${script} NON eseguito: i guard-rail di questa sessione non sono attivi.\n`,
);
process.exit(0);
