import { CallCopilotPanel } from "@/components/call-copilot/CallCopilotPanel";
import { Spinner } from "@/components/ui/spinner";
import { useSetPageTitle } from "@/components/layout/HeaderActions";

export function meta() {
  return [
    { title: "Call Copilot" },
    {
      name: "description",
      content:
        "Live call transcription, keyword highlights, and concise agent help beside your video call.",
    },
  ];
}

export function HydrateFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner className="size-8 text-foreground" />
    </div>
  );
}

export default function IndexPage() {
  useSetPageTitle("Call Copilot");
  return <CallCopilotPanel />;
}
