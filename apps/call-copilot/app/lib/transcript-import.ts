export function parseTranscriptUploadText(
  filename: string,
  content: string,
): string {
  const trimmed = content.trim();
  if (!trimmed) return "";

  if (filename.toLowerCase().endsWith(".vtt")) {
    return parseVttTranscript(trimmed);
  }

  return trimmed;
}

function parseVttTranscript(content: string): string {
  const lines = content.split(/\r?\n/);
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === "WEBVTT") continue;
    if (/^\d+$/.test(trimmed)) continue;
    if (/^\d{2}:\d{2}:\d{2}\.\d{3}\s+-->/.test(trimmed)) continue;
    if (/^NOTE\b/i.test(trimmed)) continue;
    output.push(trimmed);
  }

  return output.join("\n").trim();
}
