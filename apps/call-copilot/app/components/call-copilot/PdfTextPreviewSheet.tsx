import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import type { WatchKeywordEntry } from "@shared/call-copilot";

const CHUNK = 48_000;

function renderPlain(text: string): ReactNode {
  return <span className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{text}</span>;
}

function filterBySearch(text: string, query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return text;
  const lines = text.split("\n");
  const hit = lines.filter((line) => line.toLowerCase().includes(q));
  return hit.length > 0 ? hit.join("\n") : "(No matches in the loaded section.)";
}

interface PdfTextPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  keywords?: WatchKeywordEntry[];
  /** When set, fetch plain text from this URL (GET JSON `{ text: string }`). */
  fetchUrl?: string | null;
  /** Inline text (e.g. playbook content); ignored when fetchUrl is set. */
  inlineText?: string | null;
}

export function PdfTextPreviewSheet({
  open,
  onOpenChange,
  title,
  keywords = [],
  fetchUrl,
  inlineText,
}: PdfTextPreviewSheetProps) {
  const [search, setSearch] = useState("");
  const [fullText, setFullText] = useState("");
  const [visibleLen, setVisibleLen] = useState(CHUNK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setVisibleLen(CHUNK);
      setError(null);
      return;
    }

    if (fetchUrl) {
      setLoading(true);
      setFullText("");
      void fetch(fetchUrl)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load document text.");
          return r.json() as Promise<{ text?: string }>;
        })
        .then((data) => {
          setFullText(typeof data.text === "string" ? data.text : "");
        })
        .catch(() => {
          setError("Failed to load PDF text.");
          setFullText("");
        })
        .finally(() => setLoading(false));
    } else {
      setFullText(inlineText ?? "");
      setLoading(false);
    }
  }, [open, fetchUrl, inlineText]);

  const visible = useMemo(
    () => fullText.slice(0, Math.min(visibleLen, fullText.length)),
    [fullText, visibleLen],
  );

  const displayText = useMemo(
    () => filterBySearch(visible, search),
    [visible, search],
  );

  const hasMore = fullText.length > visible.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-xl md:max-w-2xl"
      >
        <SheetHeader className="border-b border-border px-4 py-3 pr-12 text-left">
          <SheetTitle className="line-clamp-2 text-base font-semibold leading-snug">
            {title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-3">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in document…"
              className="h-9 pl-8"
            />
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <Badge key={k.id ?? k.phrase} variant="secondary" className="max-w-[200px] truncate text-xs">
                  {k.phrase}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border/80 bg-muted/20">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Spinner className="size-8 text-muted-foreground" />
              </div>
            ) : error ? (
              <p className="p-4 text-sm text-destructive">{error}</p>
            ) : (
              <ScrollArea className="h-[calc(100vh-12rem)] max-h-[70vh]">
                <div className="p-4">{renderPlain(displayText)}</div>
              </ScrollArea>
            )}
          </div>

          {hasMore && !loading ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => setVisibleLen((n) => n + CHUNK)}
            >
              Load more ({fullText.length - visible.length} characters left)
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            className="mt-auto gap-2"
            onClick={() => onOpenChange(false)}
          >
            <IconX className="h-4 w-4" />
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
