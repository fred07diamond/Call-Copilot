import { useLocation } from "react-router";
import { IconMenu2, IconMessageDots } from "@tabler/icons-react";
import { useHeaderTitle, useHeaderActions } from "./HeaderActions";
import { cn } from "@/lib/utils";
const pageTitles: Record<string, string> = {
  "/": "Call Copilot",
  "/settings": "Settings",
  "/team": "Team",
};

function resolveTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/extensions")) return "Extensions";
  return "Call Copilot";
}

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
  onToggleAgent?: () => void;
  agentOpen?: boolean;
}

export function Header({ onOpenMobileSidebar, onToggleAgent, agentOpen }: HeaderProps) {
  const location = useLocation();
  const title = useHeaderTitle();
  const actions = useHeaderActions();

  return (
    <header className="flex h-12 items-center gap-3 border-b border-border bg-background px-4 lg:px-6 shrink-0">
      {onOpenMobileSidebar && (
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent md:hidden"
        >
          <IconMenu2 className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {title ?? (
          <h1 className="text-lg font-semibold tracking-tight truncate">
            {resolveTitle(location.pathname)}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <button
          type="button"
          aria-label="Toggle agent"
          onClick={onToggleAgent}
          title={agentOpen ? "Close agent" : "Open agent"}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            agentOpen
              ? "bg-accent/40 text-foreground"
              : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
          )}
        >
          <IconMessageDots size={20} aria-hidden />
        </button>
      </div>
    </header>
  );
}
