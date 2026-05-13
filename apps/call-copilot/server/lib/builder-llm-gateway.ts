/**
 * Server-side LLM calls use the same Builder gateway as agent chat
 * (`createBuilderEngine` → api.builder.io/agent-native/gateway).
 */
import {
  createBuilderEngine,
  BUILDER_DEFAULT_MODEL,
} from "@agent-native/core/agent/engine";
import type { EngineMessage } from "@agent-native/core/agent/engine";

const engine = createBuilderEngine();

export { BUILDER_DEFAULT_MODEL };

function splitMessages(messages: Array<{ role: string; content: string }>): {
  systemPrompt: string;
  engineMessages: EngineMessage[];
} {
  const systemChunks: string[] = [];
  const engineMessages: EngineMessage[] = [];
  for (const m of messages) {
    const role = m.role?.toLowerCase();
    if (role === "system") {
      systemChunks.push(m.content);
    } else if (role === "user") {
      engineMessages.push({
        role: "user",
        content: [{ type: "text", text: m.content }],
      });
    } else if (role === "assistant") {
      engineMessages.push({
        role: "assistant",
        content: [{ type: "text", text: m.content }],
      });
    }
  }
  return {
    systemPrompt: systemChunks.join("\n\n"),
    engineMessages,
  };
}

function isAbortError(e: unknown): boolean {
  return (
    e instanceof Error &&
    (e.name === "AbortError" || e.message === "This operation was aborted")
  );
}

/**
 * Single-turn completion via the agent-native Builder gateway (same path as sidebar chat).
 */
export async function runBuilderGatewayLlm(input: {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  maxOutputTokens: number;
  stream: boolean;
  onDelta?: (text: string) => void;
  signal?: AbortSignal;
  timeoutMs?: number;
}): Promise<{ text: string; timedOut: boolean }> {
  const limitMs = input.timeoutMs ?? 60_000;
  const local = new AbortController();
  let timedOut = false;
  const tid = setTimeout(() => {
    timedOut = true;
    local.abort();
  }, limitMs);
  const parent = input.signal;
  const onParentAbort = () => local.abort();
  if (parent) {
    if (parent.aborted) local.abort();
    else parent.addEventListener("abort", onParentAbort, { once: true });
  }

  const cleanup = () => {
    clearTimeout(tid);
    if (parent) parent.removeEventListener("abort", onParentAbort);
  };

  const { systemPrompt, engineMessages } = splitMessages(input.messages);
  if (engineMessages.length === 0) {
    cleanup();
    throw new Error(
      "runBuilderGatewayLlm requires at least one user or assistant message.",
    );
  }

  let aggregate = "";
  let fallbackAssistantText = "";
  let stopError: string | null = null;

  try {
    const iterable = engine.stream({
      model: input.model ?? BUILDER_DEFAULT_MODEL,
      systemPrompt: systemPrompt.trim() || "You are a helpful assistant.",
      messages: engineMessages,
      tools: [],
      abortSignal: local.signal,
      maxOutputTokens: input.maxOutputTokens,
    });

    for await (const ev of iterable) {
      if (ev.type === "text-delta" && ev.text) {
        aggregate += ev.text;
        input.onDelta?.(ev.text);
      }
      if (ev.type === "assistant-content") {
        fallbackAssistantText = ev.parts
          .filter(
            (p): p is { type: "text"; text: string } =>
              p.type === "text" && typeof (p as { text?: string }).text === "string",
          )
          .map((p) => p.text)
          .join("");
      }
      if (ev.type === "stop") {
        if (ev.reason === "error") {
          stopError =
            ev.error ??
            (ev.errorCode ? `LLM error (${ev.errorCode})` : "LLM gateway error");
        }
        break;
      }
    }
  } catch (e) {
    if (isAbortError(e) && (timedOut || local.signal.aborted)) {
      cleanup();
      return { text: aggregate || fallbackAssistantText, timedOut };
    }
    cleanup();
    throw e;
  }

  cleanup();

  const textOut = aggregate || fallbackAssistantText;

  if (stopError) {
    if (timedOut && textOut.trim()) {
      return { text: textOut, timedOut: true };
    }
    throw new Error(stopError);
  }

  if (timedOut) {
    return { text: textOut, timedOut: true };
  }

  return { text: textOut, timedOut: false };
}
