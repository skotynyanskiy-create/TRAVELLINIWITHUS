import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC_DIR = '.claude/agents';
const OUT_DIR = '.codex/agents';

function parseAgentMd(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');
  const [, frontmatter, body] = match;
  const fields = {};
  for (const line of frontmatter.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    fields[key] = value;
  }
  return { name: fields.name, description: fields.description, body: body.trim() };
}

function tomlTriple(value) {
  // TOML basic multi-line strings delimited by """ cannot contain an
  // unescaped """ sequence; escape the closing quote if it appears.
  const safe = value.replace(/"""/g, '\\"\\"\\"');
  return `"""${safe}"""`;
}

function main() {
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
  let written = 0;
  for (const file of files) {
    const raw = readFileSync(join(SRC_DIR, file), 'utf8');
    const { name, description, body } = parseAgentMd(raw);
    if (!name) {
      console.warn(`SKIP ${file}: missing name in frontmatter`);
      continue;
    }
    const toml = `name = ${JSON.stringify(name)}\ndescription = ${tomlTriple(description)}\ndeveloper_instructions = ${tomlTriple(body)}\n`;
    writeFileSync(join(OUT_DIR, `${name}.toml`), toml, 'utf8');
    written += 1;
  }
  console.log(`Synced ${written} Codex agent definitions from ${SRC_DIR} to ${OUT_DIR}`);
}

main();
