---
name: travellini-growth-revenue-operator
description: Prioritize Travelliniwithus growth, partnership, media kit, affiliate, shop, campaign, and analytics work so marketing effort turns into measurable business outcomes.
license: internal
---

# Travellini Growth Revenue Operator

Use this skill for growth strategy, partner pipeline decisions, media kit positioning, campaign prioritization, affiliate/shop planning, lead qualification, offer design, conversion instrumentation, and monthly marketing reporting.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/`
5. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
6. `docs/MARKETING_OPERATIONS_HUB.md`
7. `docs/10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN.md`
8. relevant notes under `docs/11_Campaigns/`, `docs/12_Partnerships/`, `docs/13_Content/`, or `docs/90_Templates/`

## Source Adaptation

This local skill is adapted from agency-style growth, sales, analytics, and campaign planning patterns reviewed in the public `msitarzewski/agency-agents` catalog at commit `783f6a72bfd7f3135700ac273c619d92821b419a`.

Do not import generic agency playbooks directly. Reduce them to the Travelliniwithus operating model: Italian-first brand, people-led travel authority, useful editorial discovery, partner credibility, transparent monetization, and measurable but privacy-aware conversion loops.

## Operating Principles

- Start from the business goal, not the channel: brand clarity, organic discovery, partnership conversion, lead capture, affiliate/shop monetization.
- Prefer one strong next action over a large generic plan.
- Keep B2B conversion visible but never at the expense of reader trust.
- Treat media kit, collaborations, content, newsletter, shop, and analytics as one connected funnel.
- Do not invent analytics, rates, prices, partner names, revenue, bookings, or audience data.
- Do not recommend paid spend until the landing page, tracking, offer, and follow-up path are clear.
- Do not unlock real checkout or push a product launch until product, delivery, refund/support, and Stripe checks are ready.

## Workflow

1. Define the objective, audience, offer, channel, conversion action, and decision owner.
2. Check the current campaign, partner, content, product, and release notes.
3. Choose the highest-leverage path:
   - Partnership: fit, proof points, offer hypothesis, deliverables, next message, follow-up.
   - Media kit: page/PDF CTA, qualification form, proof, objections, tracking event.
   - Campaign: audience, promise, channels, assets, timeline, KPI, owner.
   - Affiliate/shop: product fit, trust risk, content support, price hypothesis, checkout readiness.
   - Analytics: event name, trigger, properties, dashboard question, next decision.
4. Convert the plan into the relevant repo artifact or note using `docs/90_Templates/`.
5. Define one primary metric, one secondary metric, and the next decision the result should inform.

## Guardrails

- Do not create a partnership or campaign record without using `TPL_Partner.md`, `TPL_Campaign.md`, or `TPL_Collaboration.md` unless the user only asked for a lightweight draft.
- Do not create a product plan without checking `TPL_Product.md` and the V2 shop readiness constraints.
- Do not ask for more data when a clear assumption and a small next step are enough.
- Do not recommend aggressive scarcity, fake urgency, inflated proof, or misaligned brand deals.
- Do not make technical tracking changes directly; specify the event contract and coordinate with implementation and release QA.

## Output Standard

Return the smallest useful artifact:

- growth priority: action, why now, owner, asset needed, metric, next decision
- partner plan: fit, offer hypothesis, proof points, deliverables, next step, risk
- campaign brief: objective, audience, offer, channels, assets, KPI, timeline
- media kit plan: CTA, proof block, form questions, follow-up, tracking events
- monetization plan: product/affiliate fit, trust risk, content support, launch gate, metric
- analytics contract: event name, trigger, properties, dashboard question, decision
