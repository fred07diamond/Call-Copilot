/**
 * Global auth middleware — runs for ALL requests (page routes, API routes,
 * framework routes). The auth plugin configures the guard; this middleware
 * enforces it on every request.
 *
 * Without this, auth only runs for /_agent-native/* routes because the
 * framework handler's middleware registry is scoped to that catch-all.
 * Page routes (/, /settings) and API routes (/api/*) would bypass auth.
 */
import { defineEventHandler } from "h3";
import { runAuthGuard } from "@agent-native/core/server";

// These paths bypass the auth guard (public endpoints)
const PUBLIC_PATHS = ["/api/dev-login"];

export default defineEventHandler(async (event) => {
  const url = event.path?.split("?")[0] ?? "";
  if (PUBLIC_PATHS.some((p) => url === p || url.startsWith(p + "/"))) {
    return;
  }
  return runAuthGuard(event);
});
