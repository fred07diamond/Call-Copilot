import { IconMicrophone, IconSearch, IconSettings } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type CallCopilotMainSection = "transcript" | "analysis" | "settings";

interface CallCopilotFloatingNavProps {
  section: CallCopilotMainSection;
  onSectionChange: (section: CallCopilotMainSection) => void;
}

const NAV: {
  id: CallCopilotMainSection;
  label: string;
  icon: typeof IconMicrophone;
}[] = [
  { id: "transcript", label: "Live transcript", icon: IconMicrophone },
  { id: "analysis", label: "Call analysis", icon: IconSearch },
  { id: "settings", label: "Settings", icon: IconSettings },
];

export function CallCopilotFloatingNav({
  section,
  onSectionChange,
}: CallCopilotFloatingNavProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <nav
        aria-label="Call Copilot sections"
        className="pointer-events-auto fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-white/10 bg-zinc-950/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md md:flex"
      >
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-primary/25 text-primary"
                      : "text-zinc-400 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" stroke={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <nav
        aria-label="Call Copilot sections"
        className="pointer-events-auto fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-zinc-950/95 p-1 shadow-xl backdrop-blur-md md:hidden"
      >
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-primary/25 text-primary"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" stroke={1.5} />
            </button>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
