# MixAI 🍸

The AI bartender for every home bar. MixAI helps you discover cocktails
you can make with the bottles you already own, chat with an AI bartender
that knows your inventory, and figure out which bottle to buy next.

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and stack decisions
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — database schema and the ingredient taxonomy
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — milestone plan

## Stack

Expo (Dev Client) · React Native · TypeScript (strict) · NativeWind ·
Expo Router · React Query · Supabase (Postgres + Edge Functions) · Vitest

## Getting started

```bash
npm install
cp .env.example .env       # fill in Supabase values (optional for the M1 shell)
npm start                  # Expo dev server; requires a dev client build
```

Native modules (auth, ads, subscriptions) mean **Expo Go is not supported** —
build a dev client once with `npx eas build --profile development`.

### Database (local)

Requires the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase start
npm run db:reset           # applies migrations + seed catalog
```

### Quality gates

```bash
npm run typecheck
npm run lint
npm test
```

CI additionally applies every migration and the seed against a fresh
Postgres and runs data assertions (`.github/ci/db-assertions.sql`),
including a can-make smoke test.

### Sentry

Crash reporting activates when `EXPO_PUBLIC_SENTRY_DSN` is set. Source-map
upload is added to the EAS build once the Sentry org/project exist.
