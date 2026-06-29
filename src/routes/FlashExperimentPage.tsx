import { Link, getRouteApi } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getFlashExperiment } from "../flashExperiments/registry";
import { signIn, signOut } from "../shoo";

const routeApi = getRouteApi("/flash-experiments/$slug");

export function FlashExperimentPage() {
  const { slug } = routeApi.useParams();
  const experiment = getFlashExperiment(slug);
  const votes = useQuery(api.flashExperiments.listVotes, { slugs: [slug] });
  const setVote = useMutation(api.flashExperiments.setVote);
  const vote = votes?.[0];

  if (!experiment) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h1 className="text-lg font-semibold text-fg">experiment not found</h1>
        <Link to="/flash-experiments" className="mt-3 inline-block text-sm text-accent-soft">
          back to experiments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link to="/flash-experiments" className="text-xs text-accent-soft">
              ← all experiments
            </Link>
            <h1 className="mt-2 text-xl font-semibold text-fg">{experiment.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted)]">
              {experiment.summary}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VoteButton
              active={vote?.viewerVote === "up"}
              onClick={() => setVote({ slug, vote: vote?.viewerVote === "up" ? null : "up" })}
            >
              + {vote?.up ?? 0}
            </VoteButton>
            <VoteButton
              active={vote?.viewerVote === "down"}
              onClick={() => setVote({ slug, vote: vote?.viewerVote === "down" ? null : "down" })}
            >
              - {vote?.down ?? 0}
            </VoteButton>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
          <button onClick={() => signIn()} className="rounded-md border border-[var(--color-border)] px-2 py-1 hover:text-fg">
            sign in to vote
          </button>
          <button onClick={signOut} className="rounded-md border border-[var(--color-border)] px-2 py-1 hover:text-fg">
            sign out
          </button>
          <span>single-change preview · not production behavior</span>
        </div>

        <ul className="mt-4 list-inside list-disc text-xs text-[var(--color-muted)]">
          {experiment.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {experiment.render()}
    </div>
  );
}

function VoteButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm transition ${
        active
          ? "border-accent/40 bg-accent/15 text-accent-soft"
          : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
