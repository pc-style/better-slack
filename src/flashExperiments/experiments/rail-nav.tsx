import { ExperimentApp } from "../ExperimentApp";
import type { FlashExperiment } from "../registry";

type RailItem = {
  label: string;
  hint?: string;
  count?: number;
  accent?: boolean;
};

const SECTIONS: { heading: string; items: RailItem[] }[] = [
  {
    heading: "workspace",
    items: [
      { label: "inbox", count: 9, accent: true },
      { label: "priority", count: 2 },
      { label: "spaces" },
      { label: "agents", hint: "3 running" },
    ],
  },
  {
    heading: "spaces",
    items: [
      { label: "Engineering", count: 4 },
      { label: "Product", count: 1 },
      { label: "Design" },
      { label: "Company" },
    ],
  },
];

function RailNav() {
  return (
    <nav className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-sm">
      {SECTIONS.map((section) => (
        <div key={section.heading} className="mb-3 last:mb-0">
          <div className="px-2 pb-1.5 text-[11px] uppercase tracking-wide text-[var(--color-muted)]">
            {section.heading}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition hover:bg-[var(--color-surface-2)] ${
                  item.accent
                    ? "bg-accent/10 text-accent-soft"
                    : "text-[var(--color-muted)] hover:text-fg"
                }`}
              >
                <span className="truncate">{item.label}</span>
                {item.count !== undefined ? (
                  <span
                    className={`shrink-0 rounded-full px-1.5 text-[11px] tabular-nums ${
                      item.accent
                        ? "bg-accent/20 text-accent-soft"
                        : "border border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    {item.count}
                  </span>
                ) : item.hint ? (
                  <span className="shrink-0 text-[11px] text-[var(--color-muted)]">
                    {item.hint}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export const railNav: FlashExperiment = {
  slug: "rail-nav",
  title: "left rail navigation",
  summary:
    "Promote inbox, priority, spaces and agents to a persistent left rail with live unread counts instead of header tabs.",
  requestedBy: "navigation review",
  status: "reviewing",
  slots: ["sidebar"],
  notes: [
    "switches the shell into its two-column path",
    "keeps the default feed and post detail untouched",
    "unread counts use accent tokens so attention reads at a glance",
  ],
  render: () => <ExperimentApp slots={{ sidebar: <RailNav /> }} />,
};
