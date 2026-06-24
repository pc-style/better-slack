import type { FunctionReturnType } from "convex/server";
import { api } from "../../convex/_generated/api";

export type EnrichedPost = FunctionReturnType<typeof api.posts.feed>[number];
export type EnrichedReply = FunctionReturnType<
  typeof api.replies.listForPost
>[number];
