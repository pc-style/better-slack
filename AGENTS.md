# Postwork — Agent Guide

Post-based team communication app (a Facebook-Workplace successor). Posts are the
top-level unit, not channels: nested replies, activity bumping, full-text search,
per-user unread + priority states, and an AI agent-summary slot on every post.

## Current project mode

This is a highly experimental flow-design prototype. Do not assume the goal is a
working production app yet; prioritize understanding, shaping, and validating the
product flow before building real app behavior.

## Stack

- **Bun** for all tooling (never npm/pnpm/yarn/npx — use `bun` / `bunx`).
- **Vite + React 19 + TypeScript** (strict, no `any`).
- **TanStack Router** (code-based routes in `src/router.tsx`).
- **Convex** — realtime DB + serverless functions (`convex/`).
- **AI SDK v7** (`ai@beta`) for agent summaries, provider-switchable.

## Commands

```bash
bun install
bun run dev         # run-p: Vite (:5173) + convex dev (:3210). DO NOT auto-run.
bun run build       # tsc -b && vite build  (the canonical check)
bun run typecheck   # tsc -b --noEmit
bun run seed        # bunx convex run seed:run  (reseed demo data)
bun run codegen     # bunx convex codegen (needs a configured deployment)
```

After code changes, verify with `bun run build`. The frontend program
transitively type-checks `convex/*.ts` via the generated `_generated/api.d.ts`,
so a green build covers both layers.

## Convex specifics (read before touching the backend)

- **Codegen / typecheck needs a deployment.** `convex codegen` fails with
  "No CONVEX_DEPLOYMENT set" unless a deployment is configured. The repo is wired
  to a **local anonymous** deployment (`.env.local` → `CONVEX_DEPLOYMENT=anonymous:...`)
  so it runs offline. To use Convex Cloud: `bunx convex dev --configure`, then
  `bun run seed`.
- **NEVER run two `convex dev` against the same anonymous deployment.** They
  collide on the shared local-backend port; the backend dies and the app hangs on
  "Loading…" while `convex dev` itself stays alive. Symptom: `curl :3210` → refused
  and `pgrep convex-local-backend` → empty. Fix: stop all dev processes and
  restart `bun run dev`.
- **The local backend persists data** in `~/.convex/anonymous-convex-backend-state/`.
- **Convex Cloud login** lives at `~/.convex/config.json`. If you must run the
  anonymous flow non-interactively while logged in, move that file aside and
  restore it after — do not leave it moved.
- **Never commit stray `convex/*.js`.** Only `convex/_generated/*.js` and `.ts`
  sources belong there; loose compiled `.js` next to a `.ts` breaks the Convex
  bundler ("Two output files share the same path"). `convex/tsconfig.json` sets
  `noEmit` to prevent this.
- Backend layout: `schema.ts` (users · posts · replies(nested) · postReads),
  `posts.ts` (feed/search/get/counts/create), `replies.ts`, `reads.ts`,
  `ai.ts` (summary action), `seed.ts`.

## AI provider (agent summaries)

`convex/ai.ts` resolves a model from Convex env vars (`bunx convex env set ...`).
`resolveModel()` returns `{ model, modelId }`; add a provider by adding a branch.

- `AI_PROVIDER=openai` (**default**): `OPENAI_API_KEY`, optional `OPENAI_MODEL`
  (default `gpt-5.4-mini`). Uses `@ai-sdk/openai`.
- `AI_PROVIDER=gateway`: `AI_GATEWAY_API_KEY`, `AI_GATEWAY_MODEL` (e.g.
  `openai/gpt-5.4-mini`). Uses `@ai-sdk/gateway`.
- `AI_PROVIDER=pioneer`: `PIONEER_API_KEY`, `PIONEER_MODEL`, optional
  `PIONEER_BASE_URL` (default `https://api.pioneer.ai/v1`, auth via `X-API-Key`
  header). Uses `@ai-sdk/openai-compatible`.

Seed posts ship **baked** summaries (`summaryModel: "seed/baked"`) so the feature
is visible without a key. Without a key, the Generate/Regenerate button surfaces a
friendly "configure a provider" message instead of crashing.

## Design Context

Strategic design context lives in `PRODUCT.md` (register, users, brand
personality, anti-references, design principles). Visual system is documented in
`DESIGN.md`. These are maintained by the `impeccable` design skill
(`.agents/skills/impeccable/`); run `$impeccable` for the command menu, or e.g.
`$impeccable critique <surface>` / `$impeccable polish <component>`. The concrete
visual rules below remain the quick reference.

## Design conventions (style is derived from pcstyle.dev)

Dark terminal/developer aesthetic. Tokens live in `src/index.css` `@theme`:

- Warm near-black: `--color-bg #0a0a0b`, `--color-surface #121014`,
  hairline `--color-border #252327`, text `--color-fg #e8e6e3`,
  muted `--color-muted #8a8782`.
- Single accent: deep wine `--color-accent #8c1862` (soft `#b53a82`). One accent
  per page — use `accent`, never reintroduce indigo/blue.
- **Monospace everywhere** (`--font-mono`). This is the defining trait.
- Small radii (cards `rounded-lg` 8px, controls `rounded-md` 6px).
- **Lowercase chrome** (nav, buttons, filters, labels). User content keeps its
  own casing.
- **No emoji / pictographs** in UI or code. Use mono text affordances
  (`/` search prompt, `ai` tag, `active 5d ago`). Typographic arrows (`←` `→`) ok.
- Priority colors are warm/muted state colors in `src/lib/format.ts`
  (urgent coral, high gold, normal grey), not the page accent.

## Code conventions

- Derive frontend types from the API, don't redeclare them:
  `FunctionReturnType<typeof api.posts.feed>` (see `src/lib/types.ts`).
- TanStack Router params are plain `string`; cast to `Id<"posts">` for Convex
  calls (see `src/routes/PostPage.tsx`).
- Vite/Node globals: `src/vite-env.d.ts` references `vite/client`;
  `tsconfig.app.json` includes `["node", "vite/client"]` types because the app
  program transitively pulls in `convex/*.ts`.

## Deployment

Frontend is a static Vite build (`dist/`) → deploy to Vercel. Convex Cloud hosts
the backend; set the AI env vars on the Convex deployment, and `VITE_CONVEX_URL`
on the frontend host.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
