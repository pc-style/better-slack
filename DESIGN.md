---
name: Postwork
description: Posts, not channels — a calm, durable record of team decisions.
colors:
  deep-wine: "#8c1862"
  wine-glow: "#b53a82"
  near-black: "#0a0a0b"
  surface: "#121014"
  surface-2: "#18151a"
  hairline: "#252327"
  ink: "#e8e6e3"
  muted: "#8a8782"
  faint: "#4a4845"
  urgent: "#ff6b6b"
  high: "#d9a441"
  normal: "#8a8782"
typography:
  display:
    fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.01em"
    fontFeature: "'ss01', 'cv01'"
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "2px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.deep-wine}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.wine-glow}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.wine-glow}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  card-post:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-post-hover:
    backgroundColor: "{colors.surface-2}"
  agent-summary:
    backgroundColor: "{colors.deep-wine}"
    textColor: "{colors.wine-glow}"
    rounded: "{rounded.lg}"
    padding: "16px"
  tag-priority:
    rounded: "{rounded.md}"
    padding: "2px 6px"
    typography: "{typography.label}"
  tag-agent:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    typography: "{typography.label}"
---

# Design System: Postwork

## 1. Overview

**Creative North Star: "The Kept Record"**

Postwork is a calm, durable log of how a team thinks and decides. The whole
surface is built to make a post feel like a permanent entry in a ledger rather
than a message scrolling past — warm near-black, monospace throughout, and a
single deep-wine accent that lights up only the things that carry signal. The
aesthetic is terminal-adjacent: a quiet engineering surface where structure and
state are the content, and chrome recedes until you need it. The voice is
lowercase and unhurried; confidence comes from clarity, not volume.

This system explicitly rejects chat clutter — no notification soup, no ephemeral
recency theater, no consumer-social engagement mechanics (likes, reactions,
algorithmic feeds). It equally rejects generic SaaS: there is no cream-and-indigo
palette, no uniformly rounded card grid, no gradient hero-metric dashboard, and
no all-caps eyebrow kicker above every section. Warmth lives in the typography and
the wine accent, never in a tinted near-white background.

Depth is conveyed by tonal layering (`near-black → surface → surface-2`) and
hairline borders rather than shadows; the page reads flat and composed at rest,
and lifts only in response to state. Density is deliberate and legible: a returning
teammate should be able to triage the whole feed at a glance.

**Key Characteristics:**

- Warm near-black canvas; one deep-wine accent, used sparingly.
- Monospace everywhere — the defining trait.
- Lowercase chrome (nav, buttons, filters, labels); user content keeps its case.
- Flat by default; depth and emphasis appear only on state.
- No emoji or pictographs — mono text affordances instead (`/`, `ai`, `agent`).
- Small radii (cards `8px`, controls `6px`, tags `2px`).

## 2. Colors

A warm near-black palette in which a single deep-wine accent carries every moment
of signal; everything else is a tonal neutral.

### Primary

- **Deep Wine** (`#8c1862`): The one accent. Carries primary actions (`+ new
  post`), the brand mark, selection, and the agent-summary frame. Used on ≤10% of
  any screen — its rarity is the point.
- **Wine Glow** (`#b53a82`): The softer, brighter sibling. Used for accent *text*
  and links (`active 5d ago`, `ai summary`, unread dot, the agent-summary label),
  and for the primary button's hover state. Where Deep Wine fills, Wine Glow
  speaks.

### Neutral

- **Near-Black** (`#0a0a0b`): The body canvas. Also the sticky header at 85%
  opacity over a backdrop blur.
- **Surface** (`#121014`): The resting surface for cards and panels — one step up
  from the canvas.
- **Surface-2** (`#18151a`): The next tonal step up, used on hover and for inset
  affordances (agent tag, code).
- **Hairline** (`#252327`): Borders and dividers. The structural grid of the UI;
  flat layering leans on these instead of shadows.
- **Ink** (`#e8e6e3`): Primary text and headings. Warm off-white, not pure white.
- **Muted** (`#8a8782`): Secondary text — metadata, snippets, labels, timestamps.
- **Faint** (`#4a4845`): The quietest neutral; backgrounds for the `normal`
  priority chip and the lowest-emphasis surfaces.

### Tertiary (priority state colors)

Warm, muted state colors — distinct from the page accent, never used as
decoration.

- **Urgent Coral** (`#ff6b6b`): The `urgent` priority chip and dot.
- **High Gold** (`#d9a441`): The `high` priority chip and dot.
- **Normal Grey** (`#8a8782`): The `normal` priority chip and dot (shares Muted).

### Named Rules

**The One Accent Rule.** There is exactly one accent — deep wine — per page. Never
reintroduce indigo, blue, or a second hue for emphasis. Priority colors are state
vocabulary, not a second accent.

**The Tinted-Neutral Ban.** The canvas stays warm near-black. Never translate
"warm" into a cream or tinted near-white background; warmth is carried by type and
the wine accent.

## 3. Typography

**Display / Body / Label Font:** `ui-monospace` system stack — SF Mono, JetBrains
Mono, Cascadia Code, Menlo, Consolas (monospace fallback).

**Character:** One monospace family in multiple weights does all the work. The
fixed-width rhythm is the brand's signature — it makes the surface read as an
engineering record. Stylistic sets `ss01` and `cv01` are on; tracking is a subtle
`-0.01em` across the board. No second family, ever.

### Hierarchy

- **Display / Brand** (600, `0.875rem`, 1.2): The wordmark and the densest header
  labels. Postwork has no large hero type — this is a product surface, so the
  "display" tier stays compact.
- **Title** (600, `0.9375rem`, 1.3): Post titles in cards and on the detail page.
  Unread titles go semibold + ink; read titles drop to medium weight.
- **Body** (400, `0.875rem`, 1.65): Post bodies, replies, and summaries. Prose runs
  in `.prose-post` with `white-space: pre-wrap`; cap reading measure at ~65–75ch on
  the detail page.
- **Label** (600, `0.6875rem`, `0.02em`): Metadata, priority chips, the `agent`
  tag (uppercase here), counts. Chrome labels are lowercase; the `agent` badge is
  the one deliberate uppercase tracked element, mirroring a bot badge.

### Named Rules

**The Lowercase Chrome Rule.** All interface chrome — nav, buttons, filters,
section labels — is lowercase. User-authored content keeps its own casing. The
only sanctioned uppercase is the small tracked `agent` badge.

**The No-Emoji Rule.** No emoji or pictographs in UI or content chrome. Use mono
text affordances instead (`/` search prompt, `ai`, `agent`, `active 5d ago`).
Typographic arrows (`←` `→`) are allowed.

## 4. Elevation

Flat at rest. Postwork uses no decorative drop shadows; depth is built from tonal
layering (`near-black → surface → surface-2`) and 1px hairline borders. The single
piece of elevation is the sticky header, which floats via an 85%-opacity
near-black fill over a `backdrop-blur` — a glass treatment used once, purposefully,
not as a default. Everything else gains depth or emphasis only as a *response to
state*: a card lifts to `surface-2` on hover, an unread post grows a wine-glow dot
and a semibold ink title, focus and selection brighten toward the accent.

### Named Rules

**The State-Lift Rule.** Surfaces are flat and equal at rest. Elevation, brighter
fills, and accent color are reserved for state — hover, unread, focus, selection.
If an element looks "lifted" with nothing happening, it's wrong.

## 5. Components

Earned familiarity over novelty: standard affordances, one consistent vocabulary
screen to screen. Every interactive element should read as obviously itself.

### Buttons

- **Shape:** `rounded-lg` (8px) for primary, `rounded-md` (6px) for secondary /
  ghost controls.
- **Primary:** Deep Wine fill (`#8c1862`), ink text, `6px 12px` padding; hover
  brightens to Wine Glow (`#b53a82`). Used for `+ new post`. One primary action per
  view.
- **Ghost / Secondary:** Transparent with a wine-tinted hairline border, Wine Glow
  text; hover adds a faint `accent/15` wash. Used for `generate` / `regenerate`.
- **Disabled:** `opacity-50`, `cursor-not-allowed`, no color change (e.g. an
  unsaved post's summary button).

### Cards (post)

- **Shape:** `rounded-lg` (8px), 1px hairline border, `surface` fill, `16px`
  padding. Cards top out at 8px radius — never over-round.
- **Resting → Hover:** border shifts toward `accent/40`, fill lifts to `surface-2`.
  No shadow.
- **Unread marker:** a `size-2` Wine Glow dot in the gutter; title goes semibold +
  ink. Read cards reserve the same gutter space (no layout shift).

### Agent Summary

- A distinct wine-framed panel: `accent/25` border over a barely-there
  `accent/[0.06]` wash, `rounded-lg`, `16px` padding. Header pairs an `ai` chip
  (`accent/20` fill, Wine Glow text) with a lowercase `agent summary` label. This
  is the one surface where the accent frames a whole block — its job is to make the
  catch-up affordance unmistakable.

### Tags & Chips

- **Priority chip:** `rounded-md`, `2px 6px`, a colored dot + lowercase label, tinted
  in the priority's own hue (`urgent`/`high`/`normal`). The label, not just the
  color, names the state — never color alone.
- **Space chip:** hairline-bordered, muted text, `rounded-md` (e.g. `Engineering`).
- **Agent badge:** `surface-2` fill, hairline border, muted uppercase `agent`,
  `rounded-sm` (2px). The smallest radius in the system.

### Header / Nav

- Sticky, `z-30`, 85%-opacity near-black over `backdrop-blur`, hairline bottom
  border, `max-w-3xl` centered. Brand mark is a wine `P` tile. Carries an inline
  `N unread · M urgent` status and the user switcher.

### States (all interactive components)

Standardize: default · hover · focus · active · disabled · loading · error.
Loading is text-based and in-place (`summarizing…`), never a centered spinner.
Errors render as a small `red-300`-on-`red/10` inline note, not a modal.

### Named Rules

**The Findable-Over-Fresh Rule.** Components privilege durability and triage signal
(unread, priority, activity, summary) over recency theater. If a treatment makes
the feed feel like a chat stream, it's wrong.
