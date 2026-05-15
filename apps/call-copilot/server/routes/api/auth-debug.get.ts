/**
 * Debug-only: diagnoses session/cookie state and request headers.
 * Accessible without auth. Remove before production.
 */
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  // Show request headers (helps diagnose proxy/HTTPS detection)
  const headers: Record<string, string> = {};
  event.headers.forEach((value, key) => {
    // Skip cookie values for security, just show the names
    if (key === "cookie") {
      const names = value.split(";").map((c) => c.trim().split("=")[0]).filter(Boolean);
      headers[key] = `[${names.join(", ")}]`;
    } else {
      headers[key] = value;
    }
  });

  // HTTPS detection (same logic as the framework)
  const xfProto = event.headers.get("x-forwarded-proto");
  const isHttpsFromProxy = xfProto?.split(",")[0].trim() === "https";
  const appUrl = process.env.APP_URL ?? process.env.BETTER_AUTH_URL ?? "";
  const isHttpsFromEnv = appUrl.startsWith("https://");
  const detectedAsHttps = isHttpsFromProxy || isHttpsFromEnv;

  // What cookie attributes will be used
  const cookieAttrs = detectedAsHttps
    ? "SameSite=None; Secure; Partitioned (iframe-compatible)"
    : "SameSite=Lax (NOT iframe-compatible — cookie may be blocked in Builder.io preview)";

  return {
    requestHeaders: headers,
    httpsDetection: {
      xForwardedProto: xfProto ?? "(not set)",
      isHttpsFromProxy,
      appUrl: appUrl || "(not set)",
      isHttpsFromEnv,
      detectedAsHttps,
      cookieAttributesUsed: cookieAttrs,
    },
    env: {
      APP_NAME: process.env.APP_NAME || "(not set)",
      APP_URL: process.env.APP_URL || "(not set)",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "(not set)",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET",
      AUTH_SKIP_EMAIL_VERIFICATION: process.env.AUTH_SKIP_EMAIL_VERIFICATION ?? "(not set)",
      NODE_ENV: process.env.NODE_ENV ?? "(not set)",
    },
  };
});
