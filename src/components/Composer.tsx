import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useSession } from "../lib/session";
import { Avatar } from "./Avatar";

export function Composer({
  postId,
  parentId,
  placeholder = "write a reply…",
  autoFocus = false,
  compact = false,
  onDone,
}: {
  postId: Id<"posts">;
  parentId?: Id<"replies">;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
  onDone?: () => void;
}) {
  const { currentUser, currentUserId } = useSession();
  const createReply = useMutation(api.replies.create);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!body.trim() || !currentUserId) return;
    setBusy(true);
    try {
      await createReply({ postId, parentId, authorId: currentUserId, body: body.trim() });
      setBody("");
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-2.5">
      {!compact && <Avatar user={currentUser ?? null} size={32} />}
      <div className="flex-1">
        <textarea
          value={body}
          autoFocus={autoFocus}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
          }}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-accent/50"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-[var(--color-muted)]">
            ⌘/Ctrl + Enter to send
          </span>
          <div className="flex gap-2">
            {onDone && (
              <button
                onClick={onDone}
                className="rounded-md px-3 py-1.5 text-sm text-[var(--color-muted)] transition hover:text-fg"
              >
                cancel
              </button>
            )}
            <button
              onClick={submit}
              disabled={busy || !body.trim()}
              className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-fg transition hover:bg-accent-soft disabled:opacity-40"
            >
              {busy ? "sending…" : "reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
