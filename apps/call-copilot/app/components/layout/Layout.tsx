import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import { IconMenu2 } from "@tabler/icons-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HeaderActionsProvider } from "./HeaderActions";
import { AgentPanel } from "@agent-native/core/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

const SIDEBAR_OPEN_KEY = "agent-native-sidebar-open";

function getInitialOpen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem(SIDEBAR_OPEN_KEY);
    if (saved !== null) return saved === "true";
  } catch { /* ignore */ }
  return true;
}

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Routes whose page renders its own h-12 toolbar (with title + AgentToggleButton).
 * Layout still wraps these with the left Sidebar and AgentSidebar but skips the
 * global Header so they don't double-stack a header bar.
 */
function routeOwnsToolbar(pathname: string): boolean {
  return pathname.startsWith("/extensions");
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(getInitialOpen);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleAgent = useCallback(() => {
    setAgentOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_OPEN_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Keep the framework's localStorage key in sync so AgentToggleButton data-state
  // reflects the correct open/closed state.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SIDEBAR_OPEN_KEY && e.newValue !== null) {
        setAgentOpen(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const ownsToolbar = routeOwnsToolbar(location.pathname);

  return (
    <HeaderActionsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              App navigation links
            </SheetDescription>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <div className="flex h-full flex-1 flex-col overflow-hidden min-w-0">
          {ownsToolbar ? (
            <div className="flex h-12 items-center border-b border-border px-4 md:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <IconMenu2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Header
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              onToggleAgent={toggleAgent}
              agentOpen={agentOpen}
            />
          )}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>

        {/* Agent panel — controlled directly to avoid iframe frame-forwarding issue */}
        {agentOpen && (
          <div className="hidden md:flex w-[380px] shrink-0 flex-col border-l border-border bg-background">
            <AgentPanel
              emptyStateText="Ask for help with the current call."
              suggestions={[
                "What should I say about pricing?",
                "Summarize the last few minutes.",
                "Check our docs for this objection.",
              ]}
            />
          </div>
        )}
      </div>
    </HeaderActionsProvider>
  );
}
