import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const host = '127.0.0.1';
const port = 4173;
const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const child = spawn(process.execPath, [viteBin, 'preview', '--host', host, '--port', String(port)], {
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: false,
});

let ready = false;

function probe() {
  const request = http.get(`http://${host}:${port}/`, (response) => {
    response.resume();
    if (!ready && response.statusCode && response.statusCode < 500) {
      ready = true;
      console.log('LHCI_READY');
    }
  });

  request.on('error', () => undefined);
  request.setTimeout(1000, () => request.destroy());
}

const interval = setInterval(probe, 500);
probe();

function shutdown() {
  clearInterval(interval);
  child.kill();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

child.on('exit', (code) => {
  clearInterval(interval);
  process.exit(code ?? 0);
});
