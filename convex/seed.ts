import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Seed Postwork with a scenario that shows why structured posts beat a
 * Slack-style firehose: durable decisions, threaded context, async hand-offs
 * across timezones, an incident with a clean post-mortem, and agent summaries
 * that let a returning teammate catch up in seconds.
 *
 * Run with:  bunx convex run seed:run
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe existing data so the seed is idempotent.
    for (const table of ["postReads", "replies", "posts", "users"] as const) {
      const rows = await ctx.db.query(table).collect();
      await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
    }

    const now = Date.now();

    const user = (
      name: string,
      title: string,
      initials: string,
      avatarColor: string,
    ) => ({ name, title, initials, avatarColor });

    // Warm, muted avatar palette tuned to the pcstyle.dev aesthetic.
    const userDefs = [
      user("Maya Chen", "VP Engineering", "MC", "#8c1862"),
      user("Diego Ramos", "Staff Engineer", "DR", "#9d5cff"),
      user("Priya Nair", "Product Manager", "PN", "#b53a82"),
      user("Tom Becker", "Design Lead", "TB", "#d9a441"),
      user("Aisha Khan", "Engineering Manager", "AK", "#2e7d52"),
      user("Lukas Wolf", "SRE", "LW", "#c75146"),
    ];
    const u: Record<string, Id<"users">> = {};
    for (const d of userDefs) {
      const id = await ctx.db.insert("users", d);
      u[d.initials] = id;
    }

    type ReplyDef = {
      who: string;
      at: number; // offset ms from post creation
      body: string;
      parent?: number; // index into this post's replies array
    };
    type PostDef = {
      author: string;
      title: string;
      space: string;
      priority: "urgent" | "high" | "normal";
      pinned?: boolean;
      createdAgo: number; // ms before now
      body: string;
      summary?: string;
      replies?: ReplyDef[];
    };

    const posts: PostDef[] = [
      {
        author: "MC",
        title: "Decision: We're moving the mobile app to a monthly release train",
        space: "Engineering",
        priority: "high",
        pinned: true,
        createdAgo: 6 * DAY,
        body: "Ad-hoc mobile releases are burning us — three hotfixes last week, each one a fire drill. Proposal: ship from a monthly release train with a hard cut date, plus a fast lane for security fixes only.\n\nThis post is the source of truth. If you have objections, reply here before Friday and I'll fold them in. After Friday this is the decision and I'll pin the final version.",
        summary:
          "**TL;DR**\nMobile is moving to a monthly release train with a hard cut date and a security-only fast lane, replacing ad-hoc releases.\n\n**Decisions**\n- Monthly train, cut on the last Thursday of each month.\n- Only security fixes may jump the queue.\n\n**Open questions**\n- How do we handle a half-finished feature at cut time? (Diego: feature-flag it.)\n\n**Action items**\n- Aisha to draft the rollback runbook before the first train.\n- Diego to add the release-branch automation.",
        replies: [
          {
            who: "DR",
            at: 2 * HOUR,
            body: "Strong +1. One worry: features that aren't done at cut time. Can we make feature-flagging the default so an unfinished feature just stays dark instead of blocking the train?",
          },
          {
            who: "MC",
            at: 3 * HOUR,
            body: "Yes — flag-by-default it is. If it's not flag-ready, it doesn't merge to the release branch.",
            parent: 0,
          },
          {
            who: "AK",
            at: 5 * HOUR,
            body: "I'll own the rollback runbook so we have a clean abort if a train goes bad. Draft by end of next week.",
          },
          {
            who: "DR",
            at: 1 * DAY,
            body: "Release-branch automation is up in CI. Cutting a branch is now one button.",
            parent: 0,
          },
        ],
      },
      {
        author: "LW",
        title: "Incident: checkout latency spike (RESOLVED) — post-mortem inside",
        space: "Engineering",
        priority: "urgent",
        createdAgo: 2 * DAY,
        body: "Between 14:02–14:37 UTC checkout p99 jumped to 8s. Root cause: a runaway migration held a lock on the orders table. Mitigated by killing the migration and re-running it in batches.\n\nNo data loss. Full timeline and the five-whys are in the replies. Read this instead of scrolling the alerts channel — everything you need is here.",
        summary:
          "**TL;DR**\n35-minute checkout latency spike caused by a migration locking the orders table. Mitigated by batching the migration. No data loss.\n\n**Decisions**\n- All schema migrations on hot tables must run in batches behind a flag.\n\n**Action items**\n- Lukas to add a lock-duration alert.\n- Diego to add a migration linter that blocks unbatched writes to hot tables.",
        replies: [
          {
            who: "LW",
            at: 20 * 60 * 1000,
            body: "Timeline: 14:02 first alert · 14:09 paged · 14:21 identified the migration · 14:30 killed it · 14:37 p99 back to normal.",
          },
          {
            who: "DR",
            at: 1 * HOUR,
            body: "Five-whys: why did p99 spike? Lock contention. Why? Migration took a table lock. Why? It rewrote the whole table. Why? No batching. Why? Our tooling doesn't warn on it. Fix: migration linter.",
          },
          {
            who: "LW",
            at: 90 * 60 * 1000,
            body: "Adding a lock-duration alert so we catch this in seconds next time, not minutes.",
            parent: 1,
          },
          {
            who: "MC",
            at: 3 * HOUR,
            body: "This is exactly why we post instead of chat — six weeks from now someone hits a slow migration and finds this in search instead of re-debugging it.",
          },
        ],
      },
      {
        author: "PN",
        title: "Q3 roadmap draft — async review, comment by Wednesday",
        space: "Product",
        priority: "high",
        createdAgo: 3 * DAY,
        body: "Q3 draft is ready. Three bets: (1) self-serve onboarding, (2) the new analytics dashboard, (3) mobile offline mode.\n\nPlease review async and leave threaded comments on whichever bet you have an opinion on. No meeting unless we can't resolve something in the thread. This replaces the usual 90-minute roadmap call.",
        summary:
          "**TL;DR**\nQ3 has three bets — self-serve onboarding, analytics dashboard, mobile offline mode — under async review (comment by Wednesday, no meeting).\n\n**Open questions**\n- Is offline mode too big for one quarter? (Tom: scope to read-only first.)\n\n**Action items**\n- Priya to scope offline mode to read-only for Q3.\n- Tom to mock the analytics dashboard empty state.",
        replies: [
          {
            who: "TB",
            at: 4 * HOUR,
            body: "Offline mode is huge. Could we scope Q3 to read-only offline and push sync/write to Q4? That de-risks it a lot.",
          },
          {
            who: "PN",
            at: 6 * HOUR,
            body: "Good call — read-only for Q3, write-sync becomes a Q4 candidate. Updating the doc.",
            parent: 0,
          },
          {
            who: "AK",
            at: 1 * DAY,
            body: "Self-serve onboarding has a backend dependency on the new auth flow. Flagging now so it's sequenced before, not during.",
          },
          {
            who: "TB",
            at: 1 * DAY + 5 * HOUR,
            body: "I'll mock the analytics dashboard empty state this week so eng isn't blocked on design.",
          },
        ],
      },
      {
        author: "TB",
        title: "New design system tokens are live in Figma + code",
        space: "Design",
        priority: "normal",
        createdAgo: 4 * DAY,
        body: "Color, spacing, and type tokens are now published in both Figma and the npm package. Old hardcoded values are deprecated — please migrate when you touch a component. No big-bang migration required.",
        summary:
          "**TL;DR**\nDesign tokens (color, spacing, type) are published to Figma and npm; migrate opportunistically when touching components.\n\n**Action items**\n- Everyone to swap hardcoded values for tokens as they edit components.",
        replies: [
          {
            who: "DR",
            at: 8 * HOUR,
            body: "Picked these up in the settings screen refactor today — clean. The dark-mode values just work.",
          },
        ],
      },
      {
        author: "AK",
        title: "Welcome to the team, Sofia! (starts Monday)",
        space: "Company",
        priority: "normal",
        createdAgo: 5 * DAY,
        body: "Sofia Martins joins us Monday as a senior backend engineer, coming from a payments background. Drop a welcome and, if you've got it, a pointer to one doc you wish you'd read in your first week.",
        summary:
          "**TL;DR**\nSofia Martins (senior backend, payments background) starts Monday. Teammates are collecting first-week onboarding doc recommendations.",
        replies: [
          {
            who: "DR",
            at: 2 * HOUR,
            body: "Welcome! The architecture overview post is the one to read first — it links everything else.",
          },
          {
            who: "PN",
            at: 5 * HOUR,
            body: "Welcome aboard! Skim the Q3 roadmap so you know what we're betting on.",
          },
          {
            who: "MC",
            at: 1 * DAY,
            body: "Welcome Sofia! Pairing you with Diego for your first week.",
          },
        ],
      },
      {
        author: "DR",
        title: "RFC: adopt feature flags as a first-class workflow",
        space: "Engineering",
        priority: "normal",
        createdAgo: 8 * DAY,
        body: "Now that we're on a release train, flags stop being optional. RFC: every user-facing change ships behind a flag, flags have an owner and an expiry, and stale flags get swept monthly. Reply with concerns; I'll mark this Accepted once the release train lands.",
        summary:
          "**TL;DR**\nRFC to make feature flags mandatory for user-facing changes, each with an owner and expiry, swept monthly. Pending acceptance alongside the release train.\n\n**Open questions**\n- Which flag service? (Leaning build-vs-buy toward buy.)",
        replies: [
          {
            who: "LW",
            at: 1 * DAY,
            body: "+1, but please add expiry enforcement or we'll drown in zombie flags within a quarter.",
          },
          {
            who: "DR",
            at: 1 * DAY + 2 * HOUR,
            body: "Agreed — monthly sweep is in the proposal, and I'll wire a CI warning when a flag is past expiry.",
            parent: 0,
          },
        ],
      },
      {
        author: "MC",
        title: "Reminder: no-meeting Wednesdays start this week",
        space: "Company",
        priority: "normal",
        createdAgo: 10 * DAY,
        body: "Wednesdays are now meeting-free for deep work. If something feels meeting-worthy, write a post instead and let the thread do the work. Let's see how much we can move to async.",
        summary:
          "**TL;DR**\nNo-meeting Wednesdays begin this week to protect deep work; default to posts over meetings.",
        replies: [
          {
            who: "PN",
            at: 1 * DAY,
            body: "Love it. Moving the roadmap review to a post this quarter (see the Q3 thread) instead of the usual call.",
          },
        ],
      },
    ];

    for (const p of posts) {
      const createdAt = now - p.createdAgo;
      const replyDefs = p.replies ?? [];
      const participantSet = new Set<Id<"users">>([u[p.author]]);
      for (const r of replyDefs) participantSet.add(u[r.who]);
      const lastActivityAt = replyDefs.length
        ? createdAt + Math.max(...replyDefs.map((r) => r.at))
        : createdAt;

      const postId = await ctx.db.insert("posts", {
        authorId: u[p.author],
        title: p.title,
        body: p.body,
        space: p.space,
        priority: p.priority,
        pinned: p.pinned ?? false,
        createdAt,
        lastActivityAt,
        replyCount: replyDefs.length,
        participantIds: [...participantSet],
        summary: p.summary,
        summaryModel: p.summary ? "seed/baked" : undefined,
        summaryUpdatedAt: p.summary ? createdAt : undefined,
      });

      const replyIds: Id<"replies">[] = [];
      for (const r of replyDefs) {
        const id = await ctx.db.insert("replies", {
          postId,
          parentId: r.parent !== undefined ? replyIds[r.parent] : undefined,
          authorId: u[r.who],
          body: r.body,
          createdAt: createdAt + r.at,
        });
        replyIds.push(id);
      }
    }

    return {
      users: userDefs.length,
      posts: posts.length,
      message: "Seeded Postwork demo data.",
    };
  },
});
