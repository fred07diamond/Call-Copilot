import { describe, it, expect } from "vitest";
import { parseTranscriptUploadText } from "../../app/lib/transcript-import.js";

describe("parseTranscriptUploadText", () => {
  describe("plain text files", () => {
    it("returns trimmed content for .txt file", () => {
      const result = parseTranscriptUploadText("transcript.txt", "  Hello world  ");
      expect(result).toBe("Hello world");
    });

    it("returns empty string for blank content", () => {
      const result = parseTranscriptUploadText("transcript.txt", "   ");
      expect(result).toBe("");
    });

    it("preserves multi-line text content", () => {
      const content = "Line one\nLine two\nLine three";
      const result = parseTranscriptUploadText("call.txt", content);
      expect(result).toBe(content);
    });
  });

  describe("VTT files", () => {
    it("strips WEBVTT header", () => {
      const vtt = `WEBVTT\n\nHello world`;
      const result = parseTranscriptUploadText("transcript.vtt", vtt);
      expect(result).not.toContain("WEBVTT");
      expect(result).toBe("Hello world");
    });

    it("strips timestamp lines", () => {
      const vtt = `WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHello`;
      const result = parseTranscriptUploadText("transcript.vtt", vtt);
      expect(result).not.toMatch(/-->/);
      expect(result).toContain("Hello");
    });

    it("strips numeric cue identifiers", () => {
      const vtt = `WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nFirst cue\n\n2\n00:00:03.000 --> 00:00:04.000\nSecond cue`;
      const result = parseTranscriptUploadText("transcript.vtt", vtt);
      expect(result).not.toMatch(/^\d+$/m);
      expect(result).toContain("First cue");
      expect(result).toContain("Second cue");
    });

    it("strips NOTE blocks", () => {
      const vtt = `WEBVTT\n\nNOTE This is a comment\n\nHello`;
      const result = parseTranscriptUploadText("transcript.vtt", vtt);
      expect(result).not.toContain("NOTE");
    });

    it("returns empty string for VTT with only headers", () => {
      const vtt = `WEBVTT\n\n00:00:01.000 --> 00:00:02.000`;
      const result = parseTranscriptUploadText("transcript.vtt", vtt);
      expect(result).toBe("");
    });

    it("is case-insensitive for .VTT extension", () => {
      const vtt = `WEBVTT\n\nHello`;
      const result = parseTranscriptUploadText("TRANSCRIPT.VTT", vtt);
      expect(result).toBe("Hello");
    });

    it("handles Windows line endings", () => {
      const vtt = "WEBVTT\r\n\r\n00:00:01.000 --> 00:00:02.000\r\nHello CRLF";
      const result = parseTranscriptUploadText("call.vtt", vtt);
      expect(result).toBe("Hello CRLF");
    });
  });
});
