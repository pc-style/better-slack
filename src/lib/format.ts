export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  return `${wk}w ago`;
}

export const SPACES = [
  "Engineering",
  "Product",
  "Design",
  "Company",
] as const;

export const PRIORITIES = ["urgent", "high", "normal"] as const;

export const priorityStyles: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  urgent: {
    label: "urgent",
    className: "bg-[var(--color-urgent)]/10 text-[var(--color-urgent)] border-[var(--color-urgent)]/30",
    dot: "bg-[var(--color-urgent)]",
  },
  high: {
    label: "high",
    className: "bg-[var(--color-high)]/10 text-[var(--color-high)] border-[var(--color-high)]/30",
    dot: "bg-[var(--color-high)]",
  },
  normal: {
    label: "normal",
    className: "bg-[var(--color-faint)]/20 text-[var(--color-muted)] border-[var(--color-border)]",
    dot: "bg-[var(--color-muted)]",
  },
};
