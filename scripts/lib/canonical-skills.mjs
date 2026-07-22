// Single source of truth for which .agents/skills/* directories are
// Travellini-authored project skills that must sync to every AI-tool mirror
// (.claude, .github, .cursor, .gemini/skills) and pass the doc-reference
// check in scripts/audit-agent-stack.mjs.
//
// External skill installers (skills.sh, impeccable install, etc.) also drop
// global, non-Travellini skills into .agents/skills — those are deliberately
// left off this list so they stay Claude-local instead of spraying into
// every mirror + git. Both scripts/sync-agent-skills.mjs and
// scripts/audit-agent-stack.mjs import this same Set so "what should sync"
// and "what must sync" can never drift apart again.
export const CANONICAL_SKILLS = new Set([
  'a11y-check',
  'ai-seo',
  'animate',
  'anti-ai-slop',
  'audit-browser',
  'audit-ui',
  'backup-rollback',
  'bug-triage',
  'cli-evaluator',
  'commit',
  'copywriting-italian',
  'cwv',
  'data-review',
  'deep-refactor',
  'deploy',
  'design-research',
  'explain-module',
  'firebase-check',
  'github-agent-workflow',
  'graphify',
  'higgsfield-game-generation',
  'higgsfield-generate',
  'higgsfield-hub',
  'higgsfield-marketplace-cards',
  'higgsfield-product-photoshoot',
  'higgsfield-soul-id',
  'higgsfield-video-explainer',
  'higgsfield-websites',
  'hook',
  'hooks-audit',
  'innovation-radar',
  'mcp-evaluator',
  'new-article',
  'new-page',
  'perf-audit',
  'photo-plan',
  'plan',
  'plugin-evaluator',
  'predeploy',
  'quick-review',
  'repurpose',
  'responsive-check',
  'secret-protection',
  'security-audit',
  'seo-check',
  'small-fix',
  'smoke-test',
  'social-card',
  'stripe-flow',
  'travellini-stitch-figma-bridge',
  'trend-research',
  'verify-facts',
  'weekly-review',
]);
