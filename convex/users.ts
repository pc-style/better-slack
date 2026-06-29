import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const setProfileBySubject = mutation({
  args: {
    subject: v.string(),
    name: v.string(),
    title: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    initials: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", args.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      name: args.name,
      title: args.title,
      role: args.role,
      initials: args.initials,
    });
  },
});
