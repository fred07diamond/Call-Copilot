import type { SavedCallAnalysis } from "@shared/call-analysis";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function section(title: string, body: string): string {
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

export function exportCallAnalysisPdf(analysis: SavedCallAnalysis): void {
  const result = analysis.analysisResult;
  if (!result) return;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Call Analysis</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; color: #0f172a; margin: 32px; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-top: 24px; }
      p, li { line-height: 1.6; }
      blockquote { margin: 12px 0; padding: 12px 16px; background: #f1f5f9; border-left: 4px solid #94a3b8; }
      .meta { color: #475569; margin-bottom: 24px; }
    </style>
  </head>
  <body>
    <h1>Call Analysis</h1>
    <p class="meta">${escapeHtml(analysis.prospectContext || "No prospect context provided")}</p>
    <p class="meta">Overall score: ${result.overallScore.score}/10</p>
    ${section("Overall score", `<p>${escapeHtml(result.overallScore.summary)}</p>`)}
    ${section(
      "Key strengths",
      `<p>${escapeHtml(result.keyStrengths.summary)}</p><ul>${result.keyStrengths.items
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.detail)}</li>`,
        )
        .join("")}</ul>`,
    )}
    ${section(
      "Areas to improve",
      `<p>${escapeHtml(result.areasToImprove.summary)}</p><ul>${result.areasToImprove.items
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.detail)}</li>`,
        )
        .join("")}</ul>`,
    )}
    ${section(
      "Missed opportunities",
      result.missedOpportunities.items.length > 0
        ? `<p>${escapeHtml(result.missedOpportunities.summary)}</p><ul>${result.missedOpportunities.items
            .map(
              (item) =>
                `<li>${escapeHtml(item.opportunity)} <em>(${escapeHtml(item.playbookReference)})</em></li>`,
            )
            .join("")}</ul>`
        : `<p class="meta">No missed opportunities section for this analysis tier.</p>`,
    )}
    ${section(
      "Top action items",
      `<ol>${result.topActionItems.items
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.playbookSection)}:</strong> ${escapeHtml(item.action)}</li>`,
        )
        .join("")}</ol>`,
    )}
  </body>
</html>`;

  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
