import fs from 'node:fs';
import path from 'node:path';

// Stack minimo efficace (audit 2026-07-23): no Kanban/Excalidraw (zero uso;
// pipeline = Bases, diagrammi = Canvas core). Local REST API si installa a mano
// (secret locale) e resta in community-plugins.json se già presente.
const plugins = [
  {
    id: 'dataview',
    repo: 'blacksmithgu/obsidian-dataview',
    files: ['main.js', 'manifest.json', 'styles.css']
  },
  {
    id: 'templater-obsidian',
    repo: 'SilentVoid13/Templater',
    files: ['main.js', 'manifest.json']
  },
  {
    id: 'obsidian-linter',
    repo: 'platers/obsidian-linter',
    files: ['main.js', 'manifest.json', 'styles.css']
  },
  {
    id: 'omnisearch',
    repo: 'scambier/obsidian-omnisearch',
    files: ['main.js', 'manifest.json', 'styles.css']
  }
];

const REMOVED_PLUGIN_IDS = ['obsidian-kanban', 'obsidian-excalidraw-plugin'];

const repoRoot = process.cwd();
const pluginsDir = path.join(repoRoot, 'docs', '.obsidian', 'plugins');
const configPath = path.join(repoRoot, 'docs', '.obsidian', 'community-plugins.json');

async function downloadFile(url, dest) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: status ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function setup() {
  console.log('Installazione dei migliori plugin Obsidian community...');
  
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }

  const installedIds = [];

  for (const plugin of plugins) {
    const pluginDestDir = path.join(pluginsDir, plugin.id);
    if (!fs.existsSync(pluginDestDir)) {
      fs.mkdirSync(pluginDestDir, { recursive: true });
    }

    console.log(`\nScarico plugin: ${plugin.id}...`);
    let success = true;

    for (const file of plugin.files) {
      const url = `https://github.com/` + plugin.repo + `/releases/latest/download/${file}`;
      const dest = path.join(pluginDestDir, file);
      try {
        await downloadFile(url, dest);
        console.log(`  - Scaricato ${file}`);
      } catch (err) {
        console.error(`  - ERRORE scaricando ${file}:`, err.message);
        success = false;
      }
    }

    if (success) {
      installedIds.push(plugin.id);
      console.log(`Plugin ${plugin.id} scaricato con successo.`);
    }
  }

  // Rimuovi cartelle plugin deprecati se presenti
  for (const id of REMOVED_PLUGIN_IDS) {
    const deadDir = path.join(pluginsDir, id);
    if (fs.existsSync(deadDir)) {
      fs.rmSync(deadDir, { recursive: true, force: true });
      console.log(`\nRimosso plugin deprecato: ${id}`);
    }
  }

  // Aggiorno community-plugins.json (preserva local-rest-api se già presente)
  const baseActive = ['obsidian-local-rest-api', ...installedIds];
  try {
    let activePlugins = baseActive;
    if (fs.existsSync(configPath)) {
      const existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const keepRest = existing.includes('obsidian-local-rest-api');
      activePlugins = [
        ...(keepRest ? ['obsidian-local-rest-api'] : []),
        ...installedIds.filter((id) => id !== 'obsidian-local-rest-api'),
      ];
      // dedupe
      activePlugins = [...new Set(activePlugins)];
      activePlugins = activePlugins.filter((id) => !REMOVED_PLUGIN_IDS.includes(id));
    }
    fs.writeFileSync(configPath, JSON.stringify(activePlugins, null, 2) + '\n', 'utf8');
    console.log('\ncommunity-plugins.json aggiornato:', activePlugins.join(', '));
  } catch (err) {
    console.error('\nErrore nell\'aggiornamento di community-plugins.json:', err.message);
  }

  console.log('\nInstallazione completata!');
}

setup().catch(err => {
  console.error('Fatal error during setup:', err);
  process.exit(1);
});
