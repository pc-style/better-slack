import { useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { useStore } from "../lib/store";
import { UserSwitcher } from "../components/UserSwitcher";
import { NewPostDialog } from "../components/NewPostDialog";

export function RootLayout() {
  const store = useStore();
  const counts = store.useCounts();
  const [composing, setComposing] = useState(false);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent font-bold text-fg">
              P
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">postwork</div>
              <div className="hidden text-[11px] text-[var(--color-muted)] sm:block">
                async team communication
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 text-xs md:flex">
            <Link
              to="/agents"
              className="rounded-md px-2 py-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-fg [&.active]:text-accent-soft"
            >
              agents
            </Link>
            <Link
              to="/spaces"
              className="rounded-md px-2 py-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-fg [&.active]:text-accent-soft"
            >
              spaces
            </Link>
            <Link
              to="/orgs"
              className="rounded-md px-2 py-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-fg [&.active]:text-accent-soft"
            >
              orgs
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {counts && counts.unread > 0 && (
              <div className="hidden items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs sm:flex">
                <span className="text-accent-soft">{counts.unread} unread</span>
                {counts.urgent > 0 && (
                  <span className="text-red-300">· {counts.urgent} urgent</span>
                )}
              </div>
            )}
            <button
              onClick={() => setComposing(true)}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-accent-soft"
            >
              + new post
            </button>
            <UserSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>

      {composing && <NewPostDialog onClose={() => setComposing(false)} />}
    </div>
  );
}
