import { defineEventHandler, sendRedirect, setResponseHeader, getRequestURL } from "h3";

const DEV_EMAIL = "owner@call-copilot.local";
const DEV_PASSWORD = "callcopilot-dev-2024!";
const AUTH_BASE = "/_agent-native/auth";

export default defineEventHandler(async (event) => {
  const reqUrl = getRequestURL(event);
  const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;

  // Register the dev account (no-op if already exists)
  await fetch(`${baseUrl}${AUTH_BASE}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD, name: "Owner" }),
  }).catch(() => {});

  // Sign in — capture the full response so we can forward Set-Cookie
  const response = await fetch(`${baseUrl}${AUTH_BASE}/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD }),
  });

  const cookie = response.headers.get("set-cookie");
  if (cookie) {
    setResponseHeader(event, "set-cookie", cookie);
  }

  return sendRedirect(event, "/");
});
