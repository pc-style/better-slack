import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { flashExperiments } from "../flashExperiments/registry";

export function FlashExperimentsPage() {
  const votes = useQuery(api.flashExperiments.listVotes, {
    slugs: flashExperiments.map((experiment) => experiment.slug),
  });
  const votesBySlug = new Map(votes?.map((vote) => [vote.slug, vote]));

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="text-xs text-accent-soft">flow lab</div>
        <h1 className="mt-1 text-2xl font-semibold text-fg">flash experiments</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Single-change previews for layout and flow suggestions. Vote to make
          review pressure visible without turning this into a production app.
        </p>
      </header>

      <div className="grid gap-3">
        {flashExperiments.map((experiment) => {
          const vote = votesBySlug.get(experiment.slug);
          return (
            <Link
              key={experiment.slug}
              to="/flash-experiments/$slug"
              params={{ slug: experiment.slug }}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-accent/40 hover:bg-[var(--color-surface-2)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-muted)]">
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-accent-soft">
                      {experiment.status}
                    </span>
                    {experiment.slots.map((slot) => (
                      <span key={slot} className="rounded-md border border-[var(--color-border)] px-1.5 py-0.5">
                        {slot}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-base font-semibold text-fg">{experiment.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{experiment.summary}</p>
                  <p className="mt-3 text-xs text-[var(--color-muted)]">
                    requested by {experiment.requestedBy}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-right text-xs">
                  <div className="text-accent-soft">+{vote?.up ?? 0}</div>
                  <div className="text-[var(--color-muted)]">-{vote?.down ?? 0}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
