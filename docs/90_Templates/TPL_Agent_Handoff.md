---
title: HANDOFF_<slug>_<from-agent>_to_<to-agent>
status: open | consumed | obsolete
created: YYYY-MM-DD
from: <agent name>
to: <agent name>
slug: <feature or article slug, e.g. salento-agosto-2026 or media-kit-v3>
expires: YYYY-MM-DD # delete or mark obsolete after this date
---

# Handoff: <one-line summary>

## Why this work matters

<1-2 sentences. Why is the next agent being asked to do this now? What is the user-facing goal?>

## Decisions already made

<List the decisions the previous agent locked in, so the receiver doesn't relitigate them.>

- Decision 1: ...
- Decision 2: ...

## Context the receiver needs

<Only the facts required to do the work. Link to docs/ rather than restating long content.>

- Source files: [src/...], [docs/...]
- Related docs: [...]
- Brand / voice notes specific to this piece: ...

## What the receiver should produce

<Concrete deliverable. Be specific: file paths, fields, format.>

- Output: ...
- Where it lands: <file path / commit / docs note>

## Out of scope (do NOT touch)

<Explicit guardrail to prevent scope creep.>

- ...
- ...

## Open questions / decisions for the user

<If any. Receiver should escalate these before proceeding.>

- ...

## Next hand-off

<Who likely receives after this step is done. Leave empty if this is the final step.>

- Next agent: <name or "none — review with user">
- Trigger: <what state means it's their turn>

## Notes

<Anything else worth carrying forward, including failed attempts or rejected ideas with rationale.>
