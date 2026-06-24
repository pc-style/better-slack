import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { priority } from "./schema";

export type EnrichedPost = Doc<"posts"> & {
  author: Doc<"users"> | null;
  participants: Doc<"users">[];
  unread: boolean;
};

async function enrich(
  ctx: QueryCtx,
  post: Doc<"posts">,
  viewerId: Id<"users"> | undefined,
): Promise<EnrichedPost> {
  const author = await ctx.db.get(post.authorId);
  const participants = (
    await Promise.all(post.participantIds.map((id) => ctx.db.get(id)))
  ).filter((u): u is Doc<"users"> => u !== null);

  let unread = false;
  if (viewerId) {
    const read = await ctx.db
      .query("postReads")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", viewerId).eq("postId", post._id),
      )
      .unique();
    unread = post.lastActivityAt > (read?.lastReadAt ?? 0);
  }

  return { ...post, author, participants, unread };
}

/** Activity-bumped feed with optional space / priority / unread filtering. */
export const feed = query({
  args: {
    viewerId: v.optional(v.id("users")),
    space: v.optional(v.string()),
    priority: v.optional(priority),
    onlyUnread: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let posts: Doc<"posts">[];
    if (args.space) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_space", (q) => q.eq("space", args.space!))
        .order("desc")
        .collect();
    } else {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_activity")
        .order("desc")
        .collect();
    }

    if (args.priority) {
      posts = posts.filter((p) => p.priority === args.priority);
    }

    // Pinned posts float to the top, then by activity.
    posts.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastActivityAt - a.lastActivityAt;
    });

    let enriched = await Promise.all(
      posts.map((p) => enrich(ctx, p, args.viewerId)),
    );
    if (args.onlyUnread) enriched = enriched.filter((p) => p.unread);
    return enriched;
  },
});

/** Full-text search across post titles and bodies. */
export const search = query({
  args: { term: v.string(), viewerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const term = args.term.trim();
    if (!term) return [];

    const [byBody, byTitle] = await Promise.all([
      ctx.db
        .query("posts")
        .withSearchIndex("search_body", (q) => q.search("body", term))
        .take(40),
      ctx.db
        .query("posts")
        .withSearchIndex("search_title", (q) => q.search("title", term))
        .take(40),
    ]);

    const seen = new Set<string>();
    const merged: Doc<"posts">[] = [];
    for (const p of [...byTitle, ...byBody]) {
      if (seen.has(p._id)) continue;
      seen.add(p._id);
      merged.push(p);
    }

    return await Promise.all(merged.map((p) => enrich(ctx, p, args.viewerId)));
  },
});

export const get = query({
  args: { postId: v.id("posts"), viewerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;
    return await enrich(ctx, post, args.viewerId);
  },
});

export const counts = query({
  args: { viewerId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("posts").collect();
    if (!args.viewerId) return { total: posts.length, unread: 0, urgent: 0 };
    let unread = 0;
    let urgent = 0;
    for (const post of posts) {
      const read = await ctx.db
        .query("postReads")
        .withIndex("by_user_post", (q) =>
          q.eq("userId", args.viewerId!).eq("postId", post._id),
        )
        .unique();
      const isUnread = post.lastActivityAt > (read?.lastReadAt ?? 0);
      if (isUnread) {
        unread++;
        if (post.priority === "urgent") urgent++;
      }
    }
    return { total: posts.length, unread, urgent };
  },
});

export const create = mutation({
  args: {
    authorId: v.id("users"),
    title: v.string(),
    body: v.string(),
    space: v.string(),
    priority: priority,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      authorId: args.authorId,
      title: args.title,
      body: args.body,
      space: args.space,
      priority: args.priority,
      pinned: false,
      createdAt: now,
      lastActivityAt: now,
      replyCount: 0,
      participantIds: [args.authorId],
    });
    // Author has "read" their own new post.
    await ctx.db.insert("postReads", {
      userId: args.authorId,
      postId,
      lastReadAt: now,
    });
    return postId;
  },
});
