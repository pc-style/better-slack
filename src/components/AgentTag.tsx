/**
 * Small "agent" affordance shown next to AI coding-agent authors, mirroring the
 * "APP" badge Slack renders on bot messages. Mono, lowercase, on-brand.
 */
export function AgentTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-muted)] uppercase ${className}`}
    >
      agent
    </span>
  );
}
