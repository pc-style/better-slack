import type { ReactNode } from "react";
import { ExperimentApp } from "../ExperimentApp";
import type { FlashExperiment } from "../registry";

export function WideReviewShell({ children }: { children: ReactNode }) {
  return (
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
  );
}

export const wideReviewShell: FlashExperiment = {
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
        shell: ({ children }) => <WideReviewShell>{children}</WideReviewShell>,
      }}
    />
  ),
};
