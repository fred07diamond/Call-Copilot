import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  appendTranscriptChunk,
  updateTranscriptSegment,
  updateTranscriptSpeakerLabel,
  applySpeakerLabelAssignments,
  segmentsToPlainText,
  collectLabeledContextSegments,
  collectUnlabeledSegments,
} from "../../app/lib/transcript-segments.js";
import type { TranscriptSegment } from "../../shared/transcript.js";

// Fixed time so Date.now() is deterministic
const BASE_TIME = 1_700_000_000_000;

function seg(overrides: Partial<TranscriptSegment> = {}): TranscriptSegment {
  return {
    id: "seg-1",
    text: "Hello",
    spokenAt: new Date(BASE_TIME).toISOString(),
    speaker: null,
    labelSource: null,
    labelConfidence: null,
    status: "pending",
    speakerId: "unlabeled",
    speakerLabel: "",
    startTime: BASE_TIME,
    endTime: BASE_TIME,
    ...overrides,
  };
}

describe("appendTranscriptChunk", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(BASE_TIME);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a new pending segment from empty list", () => {
    const result = appendTranscriptChunk([], "Hello world", new Date().toISOString());
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Hello world");
    expect(result[0].status).toBe("pending");
    expect(result[0].labelSource).toBeNull();
  });

  it("ignores empty/whitespace chunks", () => {
    const result = appendTranscriptChunk([], "   ", new Date().toISOString());
    expect(result).toHaveLength(0);
  });

  it("appends to an existing pending segment within pause window", () => {
    const existing = seg({ text: "First", startTime: BASE_TIME - 100, endTime: BASE_TIME - 100 });
    const result = appendTranscriptChunk([existing], "second", new Date().toISOString());
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("First second");
  });

  it("starts a new segment when pause exceeds threshold", () => {
    const existing = seg({ text: "First", startTime: BASE_TIME - 5_000, endTime: BASE_TIME - 5_000 });
    const result = appendTranscriptChunk([existing], "second", new Date().toISOString());
    expect(result).toHaveLength(2);
  });

  it("attaches punctuation without a space", () => {
    const existing = seg({ text: "Hello", startTime: BASE_TIME - 100, endTime: BASE_TIME - 100 });
    const result = appendTranscriptChunk([existing], ".", new Date().toISOString());
    expect(result[0].text).toBe("Hello.");
  });

  it("creates a labeled segment when manualSpeaker is provided", () => {
    const speaker = { speakerId: "you", speakerLabel: "You", speakerColor: "#60a5fa" };
    const result = appendTranscriptChunk([], "Hi there", new Date().toISOString(), speaker);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("labeled");
    expect(result[0].labelSource).toBe("manual");
    expect(result[0].speakerId).toBe("you");
  });

  it("merges into existing manual segment for same speaker", () => {
    const speaker = { speakerId: "you", speakerLabel: "You", speakerColor: "#60a5fa" };
    const existing = seg({
      text: "Part one",
      status: "labeled",
      labelSource: "manual",
      speakerId: "you",
      startTime: BASE_TIME - 100,
      endTime: BASE_TIME - 100,
    });
    const result = appendTranscriptChunk([existing], "part two", new Date().toISOString(), speaker);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Part one part two");
  });

  it("starts a new segment when speaker switches", () => {
    const speaker = { speakerId: "guest", speakerLabel: "Guest", speakerColor: "#4ade80" };
    const existing = seg({
      text: "You said",
      status: "labeled",
      labelSource: "manual",
      speakerId: "you",
      startTime: BASE_TIME - 100,
      endTime: BASE_TIME - 100,
    });
    const result = appendTranscriptChunk([existing], "I said", new Date().toISOString(), speaker);
    expect(result).toHaveLength(2);
    expect(result[1].speakerId).toBe("guest");
  });
});

describe("updateTranscriptSegment", () => {
  it("updates text for matching segment id", () => {
    const segments = [seg({ id: "a", text: "old" }), seg({ id: "b", text: "keep" })];
    const result = updateTranscriptSegment(segments, "a", "  new text  ");
    expect(result[0].text).toBe("new text");
    expect(result[1].text).toBe("keep");
  });

  it("does not mutate when id not found", () => {
    const segments = [seg({ id: "a", text: "same" })];
    const result = updateTranscriptSegment(segments, "z", "ignored");
    expect(result[0].text).toBe("same");
  });
});

describe("updateTranscriptSpeakerLabel", () => {
  it("applies label to all segments with matching speakerId", () => {
    const segments = [
      seg({ id: "1", speakerId: "spk-0", speakerLabel: "" }),
      seg({ id: "2", speakerId: "spk-0", speakerLabel: "" }),
      seg({ id: "3", speakerId: "spk-1", speakerLabel: "" }),
    ];
    const result = updateTranscriptSpeakerLabel(segments, "spk-0", "Alice");
    expect(result[0].speakerLabel).toBe("Alice");
    expect(result[1].speakerLabel).toBe("Alice");
    expect(result[2].speakerLabel).toBe("");
  });

  it("ignores empty label string", () => {
    const segments = [seg({ speakerId: "spk-0", speakerLabel: "Bob" })];
    const result = updateTranscriptSpeakerLabel(segments, "spk-0", "   ");
    expect(result[0].speakerLabel).toBe("Bob");
  });

  it("sets status to labeled and labelSource when applying", () => {
    const segments = [seg({ speakerId: "spk-0", status: "pending", labelSource: null })];
    const result = updateTranscriptSpeakerLabel(segments, "spk-0", "Carol");
    expect(result[0].status).toBe("labeled");
    expect(result[0].labelSource).toBe("manual");
  });
});

describe("applySpeakerLabelAssignments", () => {
  it("labels unlabeled segments with AI assignments", () => {
    const segments = [seg({ id: "x", status: "pending" })];
    const assignments = [{ id: "x", speaker: "Alice", confidence: 0.9 }];
    const colorFor = () => "#fff";
    const result = applySpeakerLabelAssignments(segments, assignments, colorFor);
    expect(result[0].speaker).toBe("Alice");
    expect(result[0].labelSource).toBe("ai");
    expect(result[0].labelConfidence).toBe(0.9);
  });

  it("skips manually labeled segments", () => {
    const segments = [seg({ id: "x", status: "labeled", labelSource: "manual", speaker: "Bob" })];
    const assignments = [{ id: "x", speaker: "Alice" }];
    const result = applySpeakerLabelAssignments(segments, assignments, () => "#fff");
    expect(result[0].speaker).toBe("Bob");
  });

  it("returns segments unchanged when assignments is empty", () => {
    const segments = [seg()];
    const result = applySpeakerLabelAssignments(segments, [], () => "#fff");
    expect(result).toEqual(segments);
  });

  it("ignores assignment with empty speaker string", () => {
    const segments = [seg({ id: "x" })];
    const assignments = [{ id: "x", speaker: "  " }];
    const result = applySpeakerLabelAssignments(segments, assignments, () => "#fff");
    expect(result[0].speaker).toBeNull();
  });
});

describe("segmentsToPlainText", () => {
  it("joins segment texts with spaces", () => {
    const segments = [
      seg({ text: "Hello" }),
      seg({ text: "world" }),
    ];
    expect(segmentsToPlainText(segments)).toBe("Hello world");
  });

  it("returns empty string for empty array", () => {
    expect(segmentsToPlainText([])).toBe("");
  });
});

describe("collectLabeledContextSegments", () => {
  it("returns only labeled segments with non-null speaker", () => {
    const segments = [
      seg({ status: "pending", speaker: null, labelSource: null }),
      seg({ status: "labeled", speaker: "Alice", labelSource: "ai" }),
      seg({ status: "labeled", speaker: "", labelSource: "ai" }),
    ];
    const result = collectLabeledContextSegments(segments);
    expect(result).toHaveLength(1);
    expect(result[0].speaker).toBe("Alice");
  });

  it("limits to the last N segments", () => {
    const segments = Array.from({ length: 10 }, (_, i) =>
      seg({ id: String(i), status: "labeled", speaker: "S", labelSource: "ai" }),
    );
    const result = collectLabeledContextSegments(segments, 3);
    expect(result).toHaveLength(3);
    expect(result[2].id).toBe("9");
  });
});

describe("collectUnlabeledSegments", () => {
  it("returns pending segments and segments with no speaker", () => {
    const segments = [
      seg({ status: "pending", speaker: null, labelSource: null }),
      seg({ status: "labeled", speaker: "Alice", labelSource: "ai" }),
      seg({ status: "labeled", speaker: null, labelSource: null }),
    ];
    const result = collectUnlabeledSegments(segments);
    expect(result).toHaveLength(2);
  });

  it("excludes manually labeled segments", () => {
    const segments = [
      seg({ status: "labeled", speaker: "Bob", labelSource: "manual" }),
    ];
    const result = collectUnlabeledSegments(segments);
    expect(result).toHaveLength(0);
  });
});
