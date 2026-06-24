import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Postwork data model — posts are the top-level unit (not channels).
 *
 *   users      → team members (in-app switcher, no real auth for the MVP)
 *   posts      → top-level threads. Bumped via `lastActivityAt`.
 *   replies    → nested replies (self-referential via `parentId`)
 *   postReads  → per-user read state, drives unread badges
 */
export const priority = v.union(
  v.literal("urgent"),
  v.literal("high"),
  v.literal("normal"),
);

export default defineSchema({
  users: defineTable({
    name: v.string(),
    title: v.string(),
    avatarColor: v.string(),
    initials: v.string(),
  }),

  posts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    body: v.string(),
    space: v.string(), // lightweight grouping label e.g. "Engineering", "Company"
    priority: priority,
    pinned: v.boolean(),
    createdAt: v.number(),
    lastActivityAt: v.number(), // activity bumping sort key
    replyCount: v.number(),
    participantIds: v.array(v.id("users")),
    // Agent-summary slot:
    summary: v.optional(v.string()),
    summaryModel: v.optional(v.string()),
    summaryUpdatedAt: v.optional(v.number()),
  })
    .index("by_activity", ["lastActivityAt"])
    .index("by_space", ["space", "lastActivityAt"])
    .searchIndex("search_body", {
      searchField: "body",
      filterFields: ["space", "priority"],
    })
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["space", "priority"],
    }),

  replies: defineTable({
    postId: v.id("posts"),
    parentId: v.optional(v.id("replies")), // null/undefined = top-level reply
    authorId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId", "createdAt"])
    .index("by_parent", ["parentId"]),

  postReads: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    lastReadAt: v.number(),
  }).index("by_user_post", ["userId", "postId"]),
});
