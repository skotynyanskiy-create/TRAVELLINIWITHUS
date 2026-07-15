import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const docsRoot = path.join(root, "docs");
const errors = [];
const warnings = [];
const allowedStatuses = {
  project: ["open", "in-progress", "blocked", "done", "archived"],
  task: ["open", "in-progress", "blocked", "done"],
  bug: ["open", "in-progress", "blocked", "done"],
  decision: ["active", "superseded", "archived"],
  meeting: ["active", "archived"],
  daily: ["active", "archived"],
  release: ["draft", "blocked", "published", "archived"],
  "ui-change": ["open", "in-progress", "done"],
  sop: ["active", "archived"],
  hub: ["active"],
  dashboard: ["active"],
  reference: ["active", "archived"],
  workflow: ["active", "archived"],
  plan: ["active", "done", "archived"],
  strategy: ["active", "archived"],
  runbook: ["active", "archived"],
  report: ["active", "archived"],
  audit: ["draft", "active", "archived"],
  evaluation: ["scout", "lab", "adopted", "rejected", "archived"],
  checklist: ["active", "archived"],
  context: ["active", "archived"],
  handoff: ["open", "consumed", "obsolete"],
  inbox: ["open", "archived"],
  scratch: ["active", "archived"],
  template: ["active", "archived"],
  article: ["idea", "draft", "review", "published", "archived"],
  guide: ["draft", "review", "published", "archived"],
  itinerary: ["draft", "review", "published", "archived"],
  place: ["visitato", "da-visitare", "archiviato"],
  "case-study": ["draft", "review", "published", "archived"],
  "content-asset": ["draft", "review", "published", "archived"],
  "fact-check-report": ["draft", "active", "archived"],
  "seo-page": ["da-ottimizzare", "in-corso", "ottimizzato"],
  campaign: ["planned", "active", "paused", "done", "archived"],
  collaboration: ["lead", "proposta", "negoziazione", "attiva", "conclusa", "rifiutata"],
  partner: ["lead", "active", "paused", "done"],
  product: ["idea", "in-sviluppo", "live", "archiviato"],
  "content-brief": ["open", "in-progress", "done"],
  "content-draft": ["draft-needs-rb-inputs", "draft", "review", "published", "archived"],
  "social-post": ["idea", "in-produzione", "review", "schedulato", "pubblicato"],
  "design-reference": ["active", "archived"],
  "web-clip": ["da-processare", "processato", "archiviato"],
};

function walk(directory, extensions, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // docs/superpowers/ is written by the superpowers:writing-plans Claude
      // Code skill, which has its own plan/spec conventions unrelated to this
      // vault's YAML schema — see DECISION taxonomy exception in OBSIDIAN_TAXONOMY.md.
      if (entry.name !== "99_Archive" && entry.name !== "superpowers") walk(filepath, extensions, files);
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(filepath);
    }
  }
  return files;
}

function relative(filepath) {
  return path.relative(root, filepath).replaceAll("\\", "/");
}

for (const filepath of walk(docsRoot, [".md"])) {
  const content = fs.readFileSync(filepath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${relative(filepath)}: frontmatter mancante`);
    continue;
  }
  let metadata;
  try {
    metadata = YAML.parse(match[1]) ?? {};
  } catch {
    errors.push(`${relative(filepath)}: frontmatter YAML non valido`);
    continue;
  }
  for (const property of ["type", "status", "area"]) {
    if (!metadata[property]) errors.push(`${relative(filepath)}: proprietà ${property} mancante`);
  }
  if (metadata.type && !allowedStatuses[metadata.type]) {
    errors.push(`${relative(filepath)}: type non registrato (${metadata.type})`);
  } else if (
    metadata.type &&
    metadata.status &&
    !allowedStatuses[metadata.type].includes(String(metadata.status))
  ) {
    errors.push(`${relative(filepath)}: status non valido per ${metadata.type} (${metadata.status})`);
  }
}

const bases = walk(path.join(docsRoot, "95_Bases"), [".base"]);
for (const filepath of bases) {
  let base;
  try {
    base = YAML.parse(fs.readFileSync(filepath, "utf8")) ?? {};
  } catch {
    errors.push(`${relative(filepath)}: YAML non valido`);
    continue;
  }
  if ("order" in base || base.filters?.filterOperator || base.filters?.conditions) {
    errors.push(`${relative(filepath)}: schema Bases legacy`);
  }
  for (const view of base.views ?? []) {
    if ("columns" in view || view.filters?.filterOperator || view.filters?.conditions) {
      errors.push(`${relative(filepath)}#${view.name}: schema vista legacy`);
    }
  }
}

for (const filepath of walk(docsRoot, [".base", ".canvas"])) {
  if (/Senza nome/i.test(path.basename(filepath))) {
    errors.push(`${relative(filepath)}: file anonimo fuori dalla quarantena`);
  }
}

const appConfigPath = path.join(root, ".obsidian", "app.json");
if (fs.existsSync(appConfigPath)) {
  const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf8"));
  const ignored = new Set(appConfig.userIgnoreFilters ?? []);
  for (const required of ["backups/", "claude-plugins-official/", "docs/99_Archive/"]) {
    if (!ignored.has(required)) errors.push(`.obsidian/app.json: filtro mancante ${required}`);
  }
} else {
  warnings.push(".obsidian/app.json assente: controllo filtri locali saltato");
}

const dashboard = fs.readFileSync(path.join(docsRoot, "OBSIDIAN_DASHBOARD.md"), "utf8");
for (const match of dashboard.matchAll(/!\[\[([^#\]]+\.base)#([^\]]+)\]\]/g)) {
  const filepath = path.join(docsRoot, match[1]);
  if (!fs.existsSync(filepath)) {
    errors.push(`Dashboard: base mancante ${match[1]}`);
    continue;
  }
  const base = YAML.parse(fs.readFileSync(filepath, "utf8")) ?? {};
  if (!(base.views ?? []).some((view) => view.name === match[2])) {
    errors.push(`Dashboard: vista mancante ${match[1]}#${match[2]}`);
  }
}

if (!fs.existsSync(path.join(docsRoot, "OBSIDIAN_INDEX.md"))) {
  errors.push("docs/OBSIDIAN_INDEX.md mancante");
}

let missingRelativeLinks = 0;
let misbasedRelativeLinks = 0;
for (const filepath of walk(docsRoot, [".md"])) {
  if (relative(filepath).startsWith("docs/90_Templates/")) continue;
  let content = fs
    .readFileSync(filepath, "utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().split(/\s+["']/)[0].replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || target.startsWith("/") || /^[a-z]+:/i.test(target)) {
      continue;
    }
    const filepathOnly = target.replace(/#.*$/, "").replace(/:\d+(?:-\d+)?$/, "");
    if (fs.existsSync(path.resolve(path.dirname(filepath), filepathOnly))) continue;
    if (fs.existsSync(path.resolve(root, filepathOnly))) misbasedRelativeLinks++;
    else missingRelativeLinks++;
  }
}
if (misbasedRelativeLinks) {
  errors.push(`${misbasedRelativeLinks} link Markdown relativi partono dalla cartella sbagliata`);
}
if (missingRelativeLinks) {
  warnings.push(`${missingRelativeLinks} riferimenti Markdown puntano a file attualmente assenti`);
}

console.log("Obsidian vault audit");
console.log(`Markdown notes: ${walk(docsRoot, [".md"]).length}`);
console.log(`Canonical bases: ${bases.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
for (const error of errors) console.log(`ERROR ${error}`);
for (const warning of warnings) console.log(`WARN  ${warning}`);
if (errors.length) process.exit(1);
console.log("PASS Obsidian vault structure and metadata are aligned.");
