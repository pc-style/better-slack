import { mutation } from "./_generated/server";
import { v } from "convex/values";

/** Mark a post as read for a user (call when the detail view opens). */
export const markRead = mutation({
  args: { userId: v.id("users"), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("postReads")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", args.userId).eq("postId", args.postId),
      )
      .unique();
    if (existing) await ctx.db.patch(existing._id, { lastReadAt: now });
    else
      await ctx.db.insert("postReads", {
        userId: args.userId,
        postId: args.postId,
        lastReadAt: now,
      });
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      const existing = await ctx.db
        .query("postReads")
        .withIndex("by_user_post", (q) =>
          q.eq("userId", args.userId).eq("postId", post._id),
        )
        .unique();
      if (existing) await ctx.db.patch(existing._id, { lastReadAt: now });
      else
        await ctx.db.insert("postReads", {
          userId: args.userId,
          postId: post._id,
          lastReadAt: now,
        });
    }
  },
});
