import { Link, getRouteApi } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../convex/_generated/api";
import { ExperimentApp } from "../flashExperiments/ExperimentApp";
import { getFlashExperiment } from "../flashExperiments/registry";
import type { FlashExperimentView } from "../router";
import { signIn, signOut, useAuth } from "../shoo";

const routeApi = getRouteApi("/flash-experiments/$slug");

export function FlashExperimentPage() {
  const { slug } = routeApi.useParams();
  const search = routeApi.useSearch();
  const view: FlashExperimentView = search.view ?? "experiment";
  const navigate = routeApi.useNavigate();

  const setView = (next: FlashExperimentView) => {
    // keep the default ("experiment") out of the URL; only persist "baseline"
    void navigate({ search: next === "baseline" ? { view: "baseline" } : {} });
  };

  const experiment = getFlashExperiment(slug);
  const votes = useQuery(api.flashExperiments.listVotes, { slugs: [slug] });
  const setVote = useMutation(api.flashExperiments.setVote);
  const vote = votes?.[0];
  const { isLoading, isAuthenticated } = useAuth();

  const handleVote = async (next: "up" | "down") => {
    if (isLoading) return;
    if (!isAuthenticated) {
      void signIn();
      return;
    }
    const value = vote?.viewerVote === next ? null : next;
    try {
      await setVote({ slug, vote: value });
    } catch (err) {
      if (
        err instanceof ConvexError &&
        typeof err.data === "object" &&
        err.data !== null &&
        (err.data as { code?: string }).code === "UNAUTHENTICATED"
      ) {
        void signIn();
        return;
      }
      console.error(err);
    }
  };

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
          <div className="flex flex-col items-end gap-2">
            <div
              role="tablist"
              aria-label="preview version"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1"
            >
              <SegmentButton
                active={view === "baseline"}
                onClick={() => setView("baseline")}
              >
                baseline
              </SegmentButton>
              <SegmentButton
                active={view === "experiment"}
                onClick={() => setView("experiment")}
              >
                experiment
              </SegmentButton>
            </div>
            <div className="flex items-center gap-2">
              <VoteButton
                active={vote?.viewerVote === "up"}
                disabled={isLoading}
                title={!isLoading && !isAuthenticated ? "sign in to vote" : undefined}
                onClick={() => void handleVote("up")}
              >
                + {vote?.up ?? 0}
              </VoteButton>
              <VoteButton
                active={vote?.viewerVote === "down"}
                disabled={isLoading}
                title={!isLoading && !isAuthenticated ? "sign in to vote" : undefined}
                onClick={() => void handleVote("down")}
              >
                - {vote?.down ?? 0}
              </VoteButton>
            </div>
            {!isLoading && !isAuthenticated ? (
              <span className="text-xs text-[var(--color-muted)]">sign in to vote</span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
          {isLoading ? (
            <span className="rounded-md border border-[var(--color-border)] px-2 py-1 opacity-60">
              …
            </span>
          ) : isAuthenticated ? (
            <span className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2 py-1">
              <span>signed in</span>
              <span aria-hidden="true">·</span>
              <button onClick={signOut} className="hover:text-fg">
                sign out
              </button>
            </span>
          ) : (
            <button
              onClick={() => void signIn()}
              className="rounded-md border border-[var(--color-border)] px-2 py-1 hover:text-fg"
            >
              sign in
            </button>
          )}
          <span>single-change preview · not production behavior</span>
        </div>

        <p className="mt-3 text-xs text-[var(--color-muted)]">
          {view === "baseline"
            ? "showing the unmodified app — switch to experiment to see the change."
            : "showing the experiment — switch to baseline to compare against the unmodified app."}
        </p>

        <ul className="mt-4 list-inside list-disc text-xs text-[var(--color-muted)]">
          {experiment.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {view === "baseline" ? <ExperimentApp /> : experiment.render()}
    </div>
  );
}

function SegmentButton({
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
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-accent/15 text-accent-soft"
          : "text-[var(--color-muted)] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function VoteButton({
  active,
  onClick,
  children,
  disabled,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "border-accent/40 bg-accent/15 text-accent-soft"
          : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
