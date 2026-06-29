import { Link } from "@tanstack/react-router";
import type { EnrichedPost } from "../lib/types";
import { Avatar } from "./Avatar";
import { AgentTag } from "./AgentTag";
import { UserRoleTag } from "./UserRoleTag";
import { timeAgo, priorityStyles } from "../lib/format";

export function PostCard({ post }: { post: EnrichedPost }) {
  const p = priorityStyles[post.priority];
  const snippet =
    post.body.length > 180 ? post.body.slice(0, 180).trimEnd() + "…" : post.body;

  return (
    <Link
      to="/posts/$postId"
      params={{ postId: post._id }}
      className="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-accent/40 hover:bg-[var(--color-surface-2)]"
    >
      <div className="flex items-start gap-3">
        {post.unread ? (
          <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-soft" title="Unread" />
        ) : (
          <span className="mt-2 size-2 shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
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
            {post.summary && (
              <span className="text-accent-soft" title="Has agent summary">
                ai summary
              </span>
            )}
          </div>

          <h3
            className={`truncate text-[15px] ${
              post.unread ? "font-semibold text-fg" : "font-medium"
            }`}
          >
            {post.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
            {snippet}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Avatar user={post.author} size={20} />
              <span>{post.author?.name ?? "Unknown"}</span>
              {post.author?.isAgent && <AgentTag />}
              <UserRoleTag role={post.author?.role} />
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
              <div className="flex -space-x-1.5">
                {post.participants.slice(0, 4).map((u) => (
                  <Avatar key={u._id} user={u} size={20} ring />
                ))}
              </div>
              <span className="tabular-nums">
                {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
              </span>
              <span title="Last activity" className="text-accent-soft">
                active {timeAgo(post.lastActivityAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
