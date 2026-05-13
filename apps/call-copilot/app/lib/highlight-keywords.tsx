import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WatchKeywordEntry } from "@shared/call-copilot";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceLabel(entry: WatchKeywordEntry): string | null {
  const label = entry.sourceLabel?.trim();
  if (label) return label;
  if (entry.sourceType === "manual") return "Manual";
  if (entry.sourceType === "seed") return "Seeded examples";
  return null;
}

export function highlightKeywords(
  text: string,
  entries: WatchKeywordEntry[],
): ReactNode[] {
  const phrases = entries
    .map((entry) => entry.phrase.trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  if (!text || phrases.length === 0) {
    return [text];
  }

  const definitions = new Map(
    entries.map((entry) => [entry.phrase.toLowerCase(), entry]),
  );

  const pattern = new RegExp(
    `(${phrases.map(escapeRegExp).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const entry = definitions.get(part.toLowerCase());
    const isMatch = Boolean(entry);
    if (!isMatch || !entry) {
      return part;
    }

    const definition = entry.definition.trim();
    const label = sourceLabel(entry);

    if (!definition) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded-sm bg-amber-500/20 px-0.5 text-foreground dark:bg-amber-400/25 dark:text-amber-100"
        >
          {part}
        </mark>
      );
    }

    return (
      <Tooltip key={`${part}-${index}`}>
        <TooltipTrigger asChild>
          <mark className="cursor-help rounded-sm bg-amber-500/20 px-0.5 text-foreground underline decoration-amber-500/40 decoration-dotted underline-offset-2 dark:bg-amber-400/25 dark:text-amber-100 dark:decoration-amber-300/50">
            {part}
          </mark>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-sm text-left text-xs leading-relaxed"
        >
          <p>{definition}</p>
          {label ? (
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Source: {label}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    );
  });
}
