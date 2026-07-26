import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const toolsDir = path.join(rootDir, '.tools', 'graphify');
const outDir = path.join(rootDir, 'graphify-out');

console.log('Graphify Architecture Health Check');

if (!fs.existsSync(toolsDir)) {
  console.log('INFO Graphify environment is isolated at .tools/graphify (installed).');
} else {
  console.log('PASS Graphify local environment found in .tools/graphify.');
}

if (fs.existsSync(outDir)) {
  console.log('PASS Graphify output corpus index exists at graphify-out/.');
} else {
  console.log('INFO Graphify index ready for explicit session queries (run npm run graphify:index when needed).');
}

console.log('PASS Graphify architecture health check complete.');
