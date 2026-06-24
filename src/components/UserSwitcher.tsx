import { useState, useRef, useEffect } from "react";
import { useSession } from "../lib/session";
import { Avatar } from "./Avatar";

export function UserSwitcher() {
  const { users, currentUser, setCurrentUserId } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pr-3 pl-1.5 transition hover:bg-[var(--color-surface-2)]"
      >
        <Avatar user={currentUser} size={28} />
        <div className="text-left leading-tight">
          <div className="text-sm font-medium">{currentUser.name}</div>
          <div className="text-[11px] text-[var(--color-muted)]">
            {currentUser.title}
          </div>
        </div>
        <span className="ml-1 text-[var(--color-muted)]">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
          <div className="border-b border-[var(--color-border)] px-3 py-2 text-[11px] tracking-wide text-[var(--color-muted)] uppercase">
            view as teammate
          </div>
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() => {
                setCurrentUserId(u._id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-[var(--color-surface-2)] ${
                u._id === currentUser._id ? "bg-[var(--color-surface-2)]" : ""
              }`}
            >
              <Avatar user={u} size={28} />
              <div className="leading-tight">
                <div className="text-sm">{u.name}</div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  {u.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
