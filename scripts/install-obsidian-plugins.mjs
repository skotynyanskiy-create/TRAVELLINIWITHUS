import fs from 'node:fs';
import path from 'node:path';

const plugins = [
  {
    id: 'dataview',
    repo: 'blacksmithgu/obsidian-dataview',
    files: ['main.js', 'manifest.json', 'styles.css']
  },
  {
    id: 'obsidian-kanban',
    repo: 'mgmeyers/obsidian-kanban',
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
  },
  {
    id: 'obsidian-excalidraw-plugin',
    repo: 'zsviczian/obsidian-excalidraw-plugin',
    files: ['main.js', 'manifest.json', 'styles.css']
  }
];

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

  // Aggiorno community-plugins.json
  if (fs.existsSync(configPath)) {
    try {
      const activePlugins = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      let updated = false;
      for (const id of installedIds) {
        if (!activePlugins.includes(id)) {
          activePlugins.push(id);
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(configPath, JSON.stringify(activePlugins, null, 2), 'utf8');
        console.log('\ncommunity-plugins.json aggiornato e plugin abilitati.');
      } else {
        console.log('\nTutti i plugin erano già abilitati in community-plugins.json.');
      }
    } catch (err) {
      console.error('\nErrore nell\'aggiornamento di community-plugins.json:', err.message);
    }
  } else {
    fs.writeFileSync(configPath, JSON.stringify(['obsidian-local-rest-api', 'extended-graph', ...installedIds], null, 2), 'utf8');
    console.log('\ncommunity-plugins.json creato e plugin abilitati.');
  }

  console.log('\nInstallazione completata!');
}

setup().catch(err => {
  console.error('Fatal error during setup:', err);
  process.exit(1);
});
