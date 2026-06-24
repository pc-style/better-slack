import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("spaces").collect();
  },
});

export const membershipsForSpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("spaceMemberships")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .collect();
  },
});

export const feedForSpace = query({
  args: {
    spaceId: v.id("spaces"),
    viewerOrgId: v.optional(v.id("orgs")),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_space_id", (q) => q.eq("spaceId", args.spaceId))
      .order("desc")
      .collect();

    return posts.filter((post) => {
      if (post.visibility !== "org") return true;
      const postWithOrg = post as typeof post & { orgId?: typeof args.viewerOrgId };
      return postWithOrg.orgId === args.viewerOrgId;
    });
  },
});
