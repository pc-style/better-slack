import { action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { generateText, type LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createGateway } from "@ai-sdk/gateway";

/**
 * Resolve a language model from environment variables.
 *
 *   AI_PROVIDER = "openai" | "gateway" | "pioneer"   (default: "openai")
 *
 * OpenAI (direct, https://platform.openai.com):
 *   OPENAI_API_KEY, OPENAI_MODEL  (default "gpt-5.4-mini")
 *
 * Vercel AI Gateway (routes to OpenAI & others):
 *   AI_GATEWAY_API_KEY, AI_GATEWAY_MODEL  (e.g. "openai/gpt-5.4-mini")
 *
 * Pioneer (OpenAI-compatible, https://docs.pioneer.ai):
 *   PIONEER_API_KEY, PIONEER_MODEL, PIONEER_BASE_URL?
 */
function resolveModel(): { model: LanguageModel; modelId: string } {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

  if (provider === "gateway") {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) throw new Error("AI_GATEWAY_API_KEY is not set");
    const modelId = process.env.AI_GATEWAY_MODEL ?? "openai/gpt-5.4-mini";
    return { model: createGateway({ apiKey })(modelId), modelId };
  }

  if (provider === "pioneer") {
    const apiKey = process.env.PIONEER_API_KEY;
    if (!apiKey) throw new Error("PIONEER_API_KEY is not set");
    const modelId = process.env.PIONEER_MODEL;
    if (!modelId) throw new Error("PIONEER_MODEL is not set");
    const pioneer = createOpenAICompatible({
      name: "pioneer",
      baseURL: process.env.PIONEER_BASE_URL ?? "https://api.pioneer.ai/v1",
      apiKey,
      // Pioneer authenticates via the X-API-Key header.
      headers: { "X-API-Key": apiKey },
    });
    return { model: pioneer.chatModel(modelId), modelId };
  }

  // Default: OpenAI directly.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const modelId = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";
  return { model: createOpenAI({ apiKey })(modelId), modelId };
}

export const getContext = internalQuery({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const author = await ctx.db.get(post.authorId);
    const replies = await ctx.db
      .query("replies")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect();
    const repliesWithAuthors = await Promise.all(
      replies.map(async (r) => ({
        name: (await ctx.db.get(r.authorId))?.name ?? "Someone",
        body: r.body,
      })),
    );
    return {
      title: post.title,
      authorName: author?.name ?? "Someone",
      body: post.body,
      replies: repliesWithAuthors,
    };
  },
});

export const saveSummary = internalMutation({
  args: {
    postId: v.id("posts"),
    summary: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      summary: args.summary,
      summaryModel: args.model,
      summaryUpdatedAt: Date.now(),
    });
  },
});

export const summarizePost = action({
  args: { postId: v.id("posts") },
  handler: async (ctx, args): Promise<string> => {
    const ctxData = await ctx.runQuery(internal.ai.getContext, {
      postId: args.postId,
    });

    const transcript = [
      `POST by ${ctxData.authorName}: ${ctxData.title}`,
      ctxData.body,
      "",
      "REPLIES:",
      ...(ctxData.replies.length
        ? ctxData.replies.map((r) => `- ${r.name}: ${r.body}`)
        : ["(no replies yet)"]),
    ].join("\n");

    const { model, modelId } = resolveModel();
    const { text } = await generateText({
      model,
      system:
        "You are the team's communication assistant. Summarize the post and its " +
        "discussion for a busy teammate who just got back online. Be concise. " +
        "Use exactly these markdown sections when relevant: '**TL;DR**' (1-2 " +
        "sentences), '**Decisions**' (bullets), '**Open questions**' (bullets), " +
        "and '**Action items**' (bullets with owner names). Omit empty sections.",
      prompt: transcript,
    });

    const summary = text.trim();
    await ctx.runMutation(internal.ai.saveSummary, {
      postId: args.postId,
      summary,
      model: modelId,
    });
    return summary;
  },
});
