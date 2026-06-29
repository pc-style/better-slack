import type { ReactNode } from "react";
import { FeedPage } from "../routes/FeedPage";
import { RootLayout } from "../routes/RootLayout";

export type ExperimentSlot = "app-shell" | "feed" | "post" | "composer";
export type ExperimentStatus = "new" | "reviewing" | "liked" | "rejected";

export type FlashExperiment = {
  slug: string;
  title: string;
  summary: string;
  requestedBy: string;
  status: ExperimentStatus;
  slots: ExperimentSlot[];
  notes: string[];
  render: () => ReactNode;
};

export const flashExperiments = [
  {
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
    render: () => (
      <ExperimentApp slots={{ feed: <PriorityFirstFeedExperiment /> }} />
    ),
  },
  {
    slug: "wide-review-shell",
    title: "wide review shell",
    summary:
      "Give experiment review more horizontal room so the app feels like a flow board instead of a narrow feed.",
    requestedBy: "layout discussion",
    status: "new",
    slots: ["app-shell"],
    notes: [
      "replaces the shell wrapper",
      "keeps the default feed inside the preview",
      "use shell overrides only for navigation/layout proposals",
    ],
    render: () => (
      <ExperimentApp
        slots={{
          shell: ({ children }) => (
            <div className="min-h-full bg-[radial-gradient(circle_at_top_left,rgba(140,24,98,0.18),transparent_32rem)]">
              <div className="mx-auto grid max-w-6xl grid-cols-[220px_minmax(0,1fr)] gap-6 px-4 py-6">
                <aside className="sticky top-6 h-[calc(100vh-3rem)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
                  <div className="mb-6 font-semibold text-fg">postwork</div>
                  <div className="space-y-2 text-[var(--color-muted)]">
                    <div className="text-accent-soft">inbox</div>
                    <div>priority</div>
                    <div>spaces</div>
                    <div>agents</div>
                  </div>
                </aside>
                <main className="min-w-0">{children}</main>
              </div>
            </div>
          ),
        }}
      />
    ),
  },
] satisfies FlashExperiment[];

type ExperimentSlots = {
  shell?: (props: { children: ReactNode }) => ReactNode;
  feed?: ReactNode;
};

export function getFlashExperiment(slug: string) {
  return flashExperiments.find((experiment) => experiment.slug === slug) ?? null;
}

function ExperimentApp({ slots }: { slots?: ExperimentSlots }) {
  const shell = slots?.shell ?? (({ children }) => <RootLayout>{children}</RootLayout>);
  return shell({ children: slots?.feed ?? <FeedPage /> });
}

function PriorityFirstFeedExperiment() {
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
