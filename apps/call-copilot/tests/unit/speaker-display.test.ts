import { describe, it, expect } from "vitest";
import {
  speakerFromManualLabel,
  toggleManualSpeakerLabel,
  speakerFromLabel,
  colorForSpeakerLabel,
  SPEAKER_COLORS,
} from "../../app/lib/speaker-display.js";

describe("speakerFromManualLabel", () => {
  it("returns correct id and color for You", () => {
    const s = speakerFromManualLabel("You");
    expect(s.speakerId).toBe("you");
    expect(s.speakerLabel).toBe("You");
    expect(s.speakerColor).toBe("#60a5fa");
  });

  it("returns correct id and color for Guest", () => {
    const s = speakerFromManualLabel("Guest");
    expect(s.speakerId).toBe("guest");
    expect(s.speakerLabel).toBe("Guest");
    expect(s.speakerColor).toBe("#4ade80");
  });
});

describe("toggleManualSpeakerLabel", () => {
  it("toggles You → Guest", () => {
    expect(toggleManualSpeakerLabel("You")).toBe("Guest");
  });

  it("toggles Guest → You", () => {
    expect(toggleManualSpeakerLabel("Guest")).toBe("You");
  });
});

describe("speakerFromLabel", () => {
  it("case-insensitive match for 'you'", () => {
    const s = speakerFromLabel("YOU");
    expect(s.speakerLabel).toBe("You");
    expect(s.speakerColor).toBe("#60a5fa");
  });

  it("case-insensitive match for 'guest'", () => {
    const s = speakerFromLabel("GUEST");
    expect(s.speakerLabel).toBe("Guest");
    expect(s.speakerColor).toBe("#4ade80");
  });

  it("handles 'Speaker 1' pattern with color index 0", () => {
    const s = speakerFromLabel("Speaker 1");
    expect(s.speakerLabel).toBe("Speaker 1");
    expect(s.speakerColor).toBe(SPEAKER_COLORS[0]);
  });

  it("handles 'Speaker 2' pattern with color index 1", () => {
    const s = speakerFromLabel("Speaker 2");
    expect(s.speakerColor).toBe(SPEAKER_COLORS[1]);
  });

  it("builds speakerId from label", () => {
    const s = speakerFromLabel("John Doe");
    expect(s.speakerId).toBe("john-doe");
  });

  it("returns a color from the SPEAKER_COLORS palette for arbitrary labels", () => {
    const s = speakerFromLabel("Some Random Name");
    expect(SPEAKER_COLORS).toContain(s.speakerColor);
  });

  it("produces consistent color for the same label", () => {
    const a = speakerFromLabel("Alice");
    const b = speakerFromLabel("Alice");
    expect(a.speakerColor).toBe(b.speakerColor);
  });

  it("trims whitespace from label", () => {
    const s = speakerFromLabel("  Bob  ");
    expect(s.speakerLabel).toBe("Bob");
    expect(s.speakerId).toBe("bob");
  });
});

describe("colorForSpeakerLabel", () => {
  it("returns a non-empty hex color string", () => {
    const color = colorForSpeakerLabel("Tester");
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("is consistent with speakerFromLabel", () => {
    const label = "ConsistencyTest";
    expect(colorForSpeakerLabel(label)).toBe(speakerFromLabel(label).speakerColor);
  });
});
