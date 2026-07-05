import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsRoot = path.join(root, "docs");
const output = path.join(docsRoot, "OBSIDIAN_INDEX.md");
const excludedFolders = new Set(["50_Scratch", "70_Assets", "90_Templates", "99_Archive"]);
const sectionNames = {
  Core: "Hub e documentazione",
  "10_Projects": "Progetti",
  "11_Campaigns": "Campagne",
  "12_Partnerships": "Partnership",
  "13_Content": "Contenuti",
  "14_Bugs": "Bug",
  "20_Decisions": "Decisioni",
  "30_Meetings": "Meeting",
  "40_Daily": "Diario",
};

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const relative = path.relative(docsRoot, filepath).replaceAll("\\", "/");
      if (!excludedFolders.has(relative.split("/")[0])) walk(filepath, files);
    } else if (entry.name.endsWith(".md") && filepath !== output) {
      files.push(filepath);
    }
  }
  return files;
}

const groups = new Map();
for (const filepath of walk(docsRoot)) {
  const relative = path.relative(docsRoot, filepath).replaceAll("\\", "/");
  const parts = relative.split("/");
  const group = parts.length === 1 ? "Core" : parts[0];
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(relative.slice(0, -3));
}

const orderedGroups = [
  "Core",
  "10_Projects",
  "11_Campaigns",
  "12_Partnerships",
  "13_Content",
  "14_Bugs",
  "20_Decisions",
  "30_Meetings",
  "40_Daily",
];

const sections = orderedGroups
  .filter((group) => groups.has(group))
  .map((group) => {
    const links = groups
      .get(group)
      .sort((a, b) => a.localeCompare(b))
      .map((note) => `- [[${note}]]`)
      .join("\n");
    return `## ${sectionNames[group] ?? group}\n\n${links}`;
  })
  .join("\n\n");

const noteCount = walk(docsRoot).length;
const content = `---
type: hub
area: workspace
status: active
tags:
  - obsidian
  - index
  - workspace
---

# Indice completo del vault

Indice generato automaticamente delle note operative versionate. Rigenerare con
\`npm run generate:obsidian-index\`.

${sections}
`;

fs.writeFileSync(output, content, "utf8");
console.log(`Generated ${path.relative(root, output)} with ${noteCount} links`);
