# MixAI — Milestone Roadmap

> Status: **Adopted**. One milestone in flight at a time — no parallel major
> systems. Each milestone ends with working, tested, shippable software.

Every milestone PR must state: goal, architecture touched, files, new
dependencies, testing done, and known risks — per our workflow rules.

---

## M0 — Architecture & founding docs ✅ (this PR)

Architecture, data model, roadmap adopted. Decisions locked: Expo Dev Client,
Supabase with logic in Edge Functions, AI behind a provider interface,
RevenueCat, server-side affiliate resolution, ads last.

## M1 — Project foundation

- Expo (Dev Client) + TypeScript strict + NativeWind + Expo Router scaffold
- Design system core: theme tokens (dark-first), `shared/ui` primitives
  (GlassPanel, Button, Text, Card, Screen), motion tokens
- Supabase project, CI (lint, typecheck, test), Sentry, EAS build profiles
- Migration 0001: full catalog + user schema from `DATA_MODEL.md`, RLS
  policies, closure-table trigger
- Seed script: initial catalog (~80 IBA-quality cocktails, ingredient tree,
  starter products) — enough to make every downstream feature real

**Exit:** app boots to a styled empty dashboard; `supabase db reset` gives a
seeded, tested database; CI green.

## M2 — Auth & profile

Email + Google + Apple sign-in, session persistence, age gate, profile row
creation, delete-account function (GDPR), Settings screen shell + dark mode
toggle (dark is default).

**Exit:** full auth lifecycle tested on iOS + Android builds.

## M3 — Bottle inventory

Ingredient/product search (server fts), add/edit/remove bottles, categories,
remaining-%, favorites, offline read via React Query persistence.

**Exit:** a new user can build their bar in under 2 minutes. This flow is the
activation moment — it gets UX polish budget.

## M4 — Cocktails & recommendations

Catalog browsing, cocktail detail (recipe, method, glass, garnish, history),
cocktail favorites, `get_makeable_cocktails` + `get_unlock_counts` SQL
functions, Home dashboard: "You can make N", "One bottle away", contextual
rails (season/time — server-computed).

**Exit:** the core product loop works end-to-end offline-tolerant.

## M5 — AI Bartender chat

`chat` Edge Function: AI provider interface, inventory + favorites injected as
context, streaming responses, per-tier quotas, chat history. Recommendation
answers grounded in the user's actual can-make set (the model is given the SQL
results — it never guesses what the user can make).

**Exit:** "I want something refreshing with what I have" returns correct,
inventory-true suggestions.

## M6 — Monetization

- `resolve-offer` Edge Function + merchant tables + click logging;
  "unlock" upsell surfaces on dashboard, missing-ingredient rows, and chat
- RevenueCat integration, entitlements webhook, paywall screen, premium gates
  (AI quota, scans)
- `AdService` abstraction + AdMob (banner + interstitial + rewarded) driven by
  `ad-policy` endpoint; never on preparation screens; premium = no ads

**Exit:** money can flow in all three streams in at least one country (NL)
plus US; adding a merchant requires only DB rows.

## M7 — Launch hardening

Accessibility pass, performance pass (cold start, list virtualization, image
pipeline), analytics events for the activation funnel, store assets, age
rating, privacy labels, beta via TestFlight/Play internal.

## Phase 2 (post-launch) — Vision

Bottle photo → brand/type/fill-level via vision model behind the existing
provider interface; barcode scan against `products.barcode`; scan quotas by
tier.

## Phase 3 — Personalization & Party mode

Taste profile learning (explicit signals first, embeddings second), pgvector
ranking layer, seasonal/weather context, party planner (guests, budget,
batching math, shopping list with affiliate links — party mode is the highest
affiliate-intent surface in the app).
