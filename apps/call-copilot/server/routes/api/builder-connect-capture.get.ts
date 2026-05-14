/**
 * Manual Builder credential capture for the cloud/Fusion environment.
 *
 * Problem: Builder's /cli-auth always redirects to localhost:10110 (its CLI
 * agent port) after the user authorizes. In the cloud dev environment there is
 * no CLI agent running, so the redirect fails with ERR_CONNECTION_REFUSED.
 *
 * Fix: The user takes the failed URL (localhost:10110/auth?p-key=...&api-key=...),
 * replaces "localhost:10110/auth" with this route's public URL, and navigates
 * there. This route reads the credentials and writes them to .env.local, then
 * the server hot-reloads with the Builder keys configured.
 *
 * Usage: replace  localhost:10110/auth?p-key=X&api-key=Y&...
 *         with    https://<fusion-url>/api/builder-connect-capture?p-key=X&api-key=Y
 */
import { defineEventHandler, getQuery, setResponseHeader } from "h3";
import { upsertEnvFile } from "@agent-native/core/server";
import { resolve } from "path";

const ENV_FILE = resolve(process.cwd(), ".env.local");

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");

  const query = getQuery(event);
  const privateKey =
    typeof query["p-key"] === "string" ? query["p-key"].trim() : "";
  const publicKey =
    typeof query["api-key"] === "string" ? query["api-key"].trim() : "";

  if (!privateKey || !publicKey) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem">
      <h2>&#x274C; Missing credentials</h2>
      <p>Both <code>p-key</code> and <code>api-key</code> query parameters are required.</p>
      <p>Copy the full URL from the failed Builder redirect page (starting with
      <code>localhost:10110/auth?p-key=...</code>) and replace
      <code>localhost:10110/auth</code> with this page's URL.</p>
    </body></html>`;
  }

  try {
    await upsertEnvFile(ENV_FILE, {
      BUILDER_PRIVATE_KEY: privateKey,
      BUILDER_PUBLIC_KEY: publicKey,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem">
      <h2>&#x274C; Failed to save credentials</h2>
      <pre>${msg}</pre>
    </body></html>`;
  }

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;max-width:480px;margin:auto">
    <h2>&#x2705; Builder connected!</h2>
    <p>Your Builder API keys have been saved. The dev server will reload in a moment.</p>
    <p>Once the server restarts, close this tab and reload the app — the AI assistant
    will be powered by Builder.</p>
    <p style="margin-top:1.5rem">
      <a href="/" style="background:#4f46e5;color:#fff;padding:.6rem 1.2rem;border-radius:.4rem;text-decoration:none">
        Go to app &rarr;
      </a>
    </p>
  </body></html>`;
});
