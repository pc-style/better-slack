# Next

Postwork is in a good prototype moment: the strongest shell/composer experiments are being graduated, while the core app already proves posts, nested replies, unread state, search, and agent summaries. The next work should make those flows routable, coherent, and evaluable without re-litigating the in-progress shell changes.

## 1. make feed triage routable

**Why it matters:** `HANDOFF.md` explicitly says not to ship priority-first-feed filter links until `FeedPage` accepts URL search params, because `/?priority=urgent` silently no-ops today. The code confirms `src/routes/FeedPage.tsx` keeps `term`, `space`, `priority`, and `onlyUnread` in local `useState`, so filters are not shareable, restorable, or usable by navigation experiments.

**Done looks like:** the canonical feed reads and writes URL search params for `q`, `space`, `priority`, and `unread`; filter chips update the URL without losing scroll unnecessarily; direct links like `/?priority=urgent&unread=1` produce the expected feed; invalid params are ignored or normalized; search and filter empty states remain clear.

**Main files / areas:** `src/router.tsx`, `src/routes/FeedPage.tsx`, `src/lib/format.ts`, any experiment or nav entry point that wants to link into filtered feed states.

**Effort:** M.

**Risks / dependencies:** coordinate with the concurrent `FeedPage` graduation work before editing. TanStack Router search-param typing should stay simple and strict; avoid making the feed feel like an advanced query UI.

## 2. consolidate the post composer into one product primitive

**Why it matters:** the bottom-docked quick-post composer is being graduated, but the app still has multiple creation surfaces with different behavior: `src/components/NewPostDialog.tsx`, `src/components/WallPostDialog.tsx`, the post detail `Composer`, and the space-local composer in `src/routes/SpacePage.tsx`. `src/lib/store.tsx` only creates normal and wall posts in the session overlay, while `src/lib/spaces.tsx` has a separate session-only space post model that cannot open as a durable thread.

**Done looks like:** one composer vocabulary covers quick posts, normal posts, wall posts, replies, and space posts where appropriate; title/body/priority/space affordances are consistent; created posts navigate to or appear in the relevant durable thread surface; validation and disabled states match across surfaces.

**Main files / areas:** `src/components/Composer.tsx`, `src/components/NewPostDialog.tsx`, `src/components/WallPostDialog.tsx`, the graduated inline composer component, `src/lib/store.tsx`, `src/lib/spaces.tsx`, `src/routes/SpacePage.tsx`.

**Effort:** L.

**Risks / dependencies:** depends on the bottom-docked composer graduation. Keep this as product-flow consolidation, not a backend persistence rewrite, unless the prototype needs persistent demo writes later.

## 3. make spaces first-class threads, not a parallel mock feed

**Why it matters:** `convex/schema.ts` already models `spaceId`, `visibility`, orgs, spaces, and memberships, and `convex/spaces.ts` has queries for `feedForSpace`. But the frontend space experience in `src/lib/spaces.tsx` uses baked in-memory orgs/spaces/posts, and `src/routes/SpacePage.tsx` renders space posts as inert `<article>` cards rather than links into `/posts/$postId`. That splits the product thesis: durable posts in the main feed, mock cards in shared spaces.

**Done looks like:** shared-space posts use the same post detail, replies, unread, priority, search, and agent-summary mechanics as normal posts; visibility is legible in the UI; org-only posts have a real viewer rule; space feeds can be linked and filtered without duplicating post-card logic.

**Main files / areas:** `convex/schema.ts`, `convex/posts.ts`, `convex/spaces.ts`, `src/lib/spaces.tsx`, `src/routes/SpacesPage.tsx`, `src/routes/SpacePage.tsx`, `src/components/PostCard.tsx`, `src/routes/PostPage.tsx`.

**Effort:** L.

**Risks / dependencies:** the public demo is intentionally no-auth and mostly session-overlay driven, while `convex/spaces.ts` assumes backend data. Decide whether spaces are still a flow-design prototype or should become Convex-backed before implementing deeply.

## 4. strengthen agent-summary and agent-task catch-up loops

**Why it matters:** the product promise names the AI agent-summary slot as a load-bearing catch-up tool. `src/components/AgentSummary.tsx` only regenerates a post-level summary on demand, and `src/lib/agentTasks.tsx` keeps investigation tasks in memory and injects the agent result as a local reply. That is fine for a demo, but the flow does not yet make stale summaries, new replies, task results, or open questions feel like one coherent catch-up layer.

**Done looks like:** users can see when a summary is stale after new activity; summary/regenerate copy explains what context is included; agent-task results are easy to find from the post and agents page; failed/no-key states are calm and consistent; the thread transcript sent to the model includes enough nested-reply context to be useful.

**Main files / areas:** `src/components/AgentSummary.tsx`, `src/components/AgentTasksPanel.tsx`, `src/components/ReplyTree.tsx`, `src/components/SendAgentButton.tsx`, `src/lib/agentTasks.tsx`, `convex/ai.ts`, `convex/agentTasks.ts`.

**Effort:** M.

**Risks / dependencies:** live model calls require env keys and should continue to fail gracefully. Do not overbuild autonomous-agent infrastructure before the catch-up reading flow is validated.

## 5. run a design/accessibility regression pass on the real surfaces

**Why it matters:** `PRODUCT.md` says triage-at-a-glance signals and quiet confidence are the core persuasion, and `DESIGN.md` sets concrete rules for contrast, one-accent usage, density, and keyboard access. The source tree has many independently built surfaces (`RootLayout`, feed, post detail, agents, spaces, walls, flash lab), so after the shell/composer graduation there is a high risk of inconsistent chrome, casing, spacing, focus, and mobile behavior.

**Done looks like:** one pass across feed, post detail, new post, replies, agents, spaces, walls, and flash experiments at desktop and narrow widths; obvious focus states and keyboard paths are verified; lowercase chrome and accent discipline are restored; empty/loading/error states use the same voice; any remaining intentionally rough prototype areas are documented.

**Main files / areas:** `src/routes/*`, `src/components/*`, `src/flashExperiments/*`, `src/index.css`, `PRODUCT.md`, `DESIGN.md`.

**Effort:** M.

**Risks / dependencies:** should run after the concurrent shell/composer/deprecation changes land. Requires a running dev server for browser verification, which the repo convention leaves to the user.
