import { FeedPage } from "../../routes/FeedPage";
import { ExperimentApp } from "../ExperimentApp";
import type { FlashExperiment } from "../registry";

export function PriorityFirstFeedExperiment() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-accent/30 bg-accent/10 p-4">
        <div className="text-xs text-accent-soft">proposed flow</div>
        <h1 className="mt-1 text-xl font-semibold text-fg">start from what needs attention</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          This experiment would make urgent, high-priority, and unread work the
          first-class entry points before the chronological feed.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ["urgent", "2 need a decision"],
            ["high", "4 active threads"],
            ["unread", "9 updates"],
          ].map(([label, detail]) => (
            <button
              key={label}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition hover:border-accent/40"
            >
              <div className="text-sm text-fg">{label}</div>
              <div className="mt-1 text-xs text-[var(--color-muted)]">{detail}</div>
            </button>
          ))}
        </div>
      </section>
      <FeedPage />
    </div>
  );
}

export const priorityFirstFeed: FlashExperiment = {
  slug: "priority-first-feed",
  title: "priority-first feed",
  summary:
    "Make priority and unread state feel like the primary navigation model, not secondary filters.",
  requestedBy: "flow review",
  status: "new",
  slots: ["feed"],
  notes: [
    "keeps the normal app shell",
    "changes only the feed surface",
    "use this as the pattern for slot-level overrides",
  ],
  render: () => <ExperimentApp slots={{ feed: <PriorityFirstFeedExperiment /> }} />,
};
