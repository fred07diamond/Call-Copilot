import { defineEventHandler, readBody } from "h3";
import {
  runSpeakerLabeling,
  type SpeakerLabelRequest,
} from "../../lib/speaker-labeler-engine.js";

function normalizeSegments(
  value: unknown,
): SpeakerLabelRequest["contextSegments"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (segment): segment is SpeakerLabelRequest["contextSegments"][number] =>
        !!segment &&
        typeof segment === "object" &&
        typeof segment.id === "string" &&
        typeof segment.text === "string",
    )
    .map((segment) => ({
      id: segment.id,
      text: segment.text,
      speaker: typeof segment.speaker === "string" ? segment.speaker : null,
    }));
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<SpeakerLabelRequest>;
  const contextSegments = normalizeSegments(body.contextSegments);
  const targetSegments = normalizeSegments(body.targetSegments);

  if (targetSegments.length === 0) {
    return { labels: [] };
  }

  try {
    const labels = await runSpeakerLabeling({
      mode: body.mode === "final" ? "final" : "incremental",
      callContextHint:
        typeof body.callContextHint === "string" ? body.callContextHint : "",
      contextSegments,
      targetSegments,
    });

    return { labels };
  } catch (error) {
    console.warn(
      "[label-speakers] Speaker labeling route failed:",
      error instanceof Error ? error.message : error,
    );
    return { labels: [] };
  }
});
