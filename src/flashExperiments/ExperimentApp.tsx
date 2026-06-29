import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "../lib/store";
import { PostCard } from "../components/PostCard";
import { ReplyTree } from "../components/ReplyTree";
import { Composer } from "../components/Composer";
import { Avatar } from "../components/Avatar";
import { AgentTag } from "../components/AgentTag";
import { AgentSummary } from "../components/AgentSummary";
import { AgentTasksPanel } from "../components/AgentTasksPanel";
import { RichText } from "../components/RichText";
import { timeAgo, priorityStyles } from "../lib/format";
import type { Id } from "../../convex/_generated/dataModel";
import type { EnrichedPost } from "../lib/types";

type SlotChildren = { children: ReactNode };

/**
 * Slots an experiment can override. Every slot has a real working default
 * (see the `Default*` components below) so an experiment overrides only the
 * smallest surface it cares about and the rest of the preview keeps working —
 * including internal feed → post → reply navigation.
 */
export type ExperimentSlots = {
  /** Wraps the whole preview. Default = the real RootLayout-style shell. */
  shell?: (props: SlotChildren) => ReactNode;
  /** Nav links inside the default shell header. */
  nav?: ReactNode;
  /** Optional side rail rendered next to content in the default shell. */
  sidebar?: ReactNode;
  /** The feed surface. Default = filterable list of postCards. */
  feed?: ReactNode;
  /** A single feed item. Default = the real PostCard. */
  postCard?: (props: { post: EnrichedPost }) => ReactNode;
  /** A post detail view. Default = the real post article + summary + tasks. */
  post?: (props: { postId: Id<"posts"> }) => ReactNode;
  /** The reply surface under a post. Default = the real ReplyTree. */
  replies?: (props: { postId: Id<"posts"> }) => ReactNode;
  /** The composer under a post. Default = the real Composer. */
  composer?: (props: { postId: Id<"posts"> }) => ReactNode;
};

/* ---- internal navigation so the preview is a real little app ---- */

type Nav =
  | { view: "feed" }
  | { view: "post"; postId: Id<"posts"> };

type ExperimentCtx = {
  slots: ExperimentSlots;
  nav: Nav;
  openPost: (postId: Id<"posts">) => void;
  openFeed: () => void;
};

const Ctx = createContext<ExperimentCtx | null>(null);

function useExperiment() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useExperiment must be used inside <ExperimentApp>");
  return ctx;
}

export function ExperimentApp({ slots = {} }: { slots?: ExperimentSlots }) {
  const [nav, setNav] = useState<Nav>({ view: "feed" });
  const ctx: ExperimentCtx = {
    slots,
    nav,
    openPost: (postId) => setNav({ view: "post", postId }),
    openFeed: () => setNav({ view: "feed" }),
  };

  const body =
    nav.view === "post" ? <ExperimentPost postId={nav.postId} /> : <ExperimentFeed />;

  const shell = slots.shell ?? DefaultShell;

  return (
    <Ctx.Provider value={ctx}>{shell({ children: body })}</Ctx.Provider>
  );
}

/* ---- default shell (mirrors RootLayout, adds nav + sidebar slots) ---- */

function DefaultShell({ children }: SlotChildren) {
  const { slots } = useExperiment();
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent font-bold text-fg">
              P
            </div>
            <div className="text-sm font-semibold leading-tight">postwork</div>
          </div>
          {slots.nav ?? <DefaultNav />}
        </div>
      </header>

      {slots.sidebar ? (
        <div className="mx-auto grid max-w-5xl grid-cols-[220px_minmax(0,1fr)] gap-6 px-4 py-6">
          <aside className="sticky top-20 h-fit">{slots.sidebar}</aside>
          <main className="min-w-0">{children}</main>
        </div>
      ) : (
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      )}
    </div>
  );
}

function DefaultNav() {
  return (
    <nav className="hidden shrink-0 items-center gap-1 text-xs md:flex">
      {["inbox", "priority", "spaces", "agents"].map((item, i) => (
        <span
          key={item}
          className={`rounded-md px-2 py-1 ${
            i === 0 ? "text-accent-soft" : "text-[var(--color-muted)]"
          }`}
        >
          {item}
        </span>
      ))}
    </nav>
  );
}

/* ---- default feed (uses real store + PostCard, wired to internal nav) ---- */

function ExperimentFeed() {
  const { slots } = useExperiment();
  if (slots.feed) return <>{slots.feed}</>;
  return <DefaultFeed />;
}

function DefaultFeed() {
  const { openPost, slots } = useExperiment();
  const store = useStore();
  const posts = store.useFeed({});

  if (posts === undefined) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-muted)]">
        Loading…
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] py-12 text-center text-sm text-[var(--color-muted)]">
        No posts yet.
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {posts.map((post) => (
        <button
          key={post._id}
          onClick={() => openPost(post._id)}
          className="block w-full text-left"
        >
          {slots.postCard ? slots.postCard({ post }) : <PreviewPostCard post={post} />}
        </button>
      ))}
    </div>
  );
}

/**
 * PostCard renders a router <Link> to /posts/$postId, which would leave the
 * preview. Inside the preview we want the card visuals but internal nav, so we
 * render PostCard inside a non-navigating wrapper. The outer button handles nav.
 */
function PreviewPostCard({ post }: { post: EnrichedPost }) {
  return (
    <div className="pointer-events-none">
      <PostCard post={post} />
    </div>
  );
}

/* ---- default post detail (uses real components, internal back nav) ---- */

function ExperimentPost({ postId }: { postId: Id<"posts"> }) {
  const { slots } = useExperiment();
  if (slots.post) return <>{slots.post({ postId })}</>;
  return <DefaultPost postId={postId} />;
}

function DefaultPost({ postId }: { postId: Id<"posts"> }) {
  const { openFeed, slots } = useExperiment();
  const store = useStore();
  const post = store.usePost(postId);
  const replies = store.useReplies(postId);

  if (post === undefined) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-muted)]">
        Loading…
      </div>
    );
  }
  if (post === null) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-muted)]">
        Post not found.{" "}
        <button onClick={openFeed} className="text-accent-soft">
          back to feed
        </button>
      </div>
    );
  }

  const p = priorityStyles[post.priority];

  return (
    <div>
      <button
        onClick={openFeed}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-muted)] transition hover:text-fg"
      >
        ← feed
      </button>

      <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
          {post.pinned && (
            <span className="rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-accent-soft">
              Pinned
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${p.className}`}
          >
            <span className={`size-1.5 rounded-full ${p.dot}`} />
            {p.label}
          </span>
          <span className="rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-[var(--color-muted)]">
            {post.space}
          </span>
        </div>

        <h1 className="text-xl font-semibold text-fg">{post.title}</h1>

        <div className="mt-2 flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
          <Avatar user={post.author} size={28} />
          <span className="text-fg">{post.author?.name}</span>
          {post.author?.isAgent && <AgentTag />}
          <span>· {post.author?.title}</span>
          <span>· {timeAgo(post.createdAt)}</span>
        </div>

        <div className="mt-4">
          <RichText text={post.body} className="prose-post text-[15px] text-fg" />
        </div>

        <div className="mt-5">
          <AgentSummary
            postId={post._id}
            summary={post.summary}
            model={post.summaryModel}
            updatedAt={post.summaryUpdatedAt}
          />
        </div>

        <div className="mt-4">
          <AgentTasksPanel postId={post._id} />
        </div>
      </article>

      <div className="mt-6">
        <h2 className="mb-1 text-sm font-semibold text-[var(--color-muted)]">
          {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
        </h2>
        {slots.replies ? (
          slots.replies({ postId: post._id })
        ) : (
          <ReplyTree replies={replies ?? []} postId={post._id} />
        )}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {slots.composer ? (
          slots.composer({ postId: post._id })
        ) : (
          <Composer postId={post._id} placeholder="add to the discussion…" />
        )}
      </div>
    </div>
  );
}

/* re-export so experiments can build cards/links without re-importing */
export { Link };
