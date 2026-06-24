export function insertCodeFence(
  value: string,
  selStart: number,
  selEnd: number,
): { value: string; selectionStart: number; selectionEnd: number } {
  const start = Math.max(0, Math.min(selStart, value.length));
  const end = Math.max(start, Math.min(selEnd, value.length));
  const selected = value.slice(start, end) || "lang\ncode";
  const prefix = start === 0 || value[start - 1] === "\n" ? "" : "\n";
  const suffix = end === value.length || value[end] === "\n" ? "" : "\n";
  const opening = `${prefix}\`\`\`\n`;
  const replacement = `${opening}${selected}\n\`\`\`${suffix}`;
  const nextValue = value.slice(0, start) + replacement + value.slice(end);
  const selectionStart = start + opening.length;
  const selectionEnd = selectionStart + selected.length;

  return { value: nextValue, selectionStart, selectionEnd };
}
