import { defineEventHandler, sendRedirect, setResponseHeader, getRequestURL } from "h3";

const DEV_EMAIL = "owner@call-copilot.local";
const DEV_PASSWORD = "callcopilot-dev-2024!";
const REGISTER_URL = "/_agent-native/auth/register";
const LOGIN_URL = "/_agent-native/auth/login";

export default defineEventHandler(async (event) => {
  const reqUrl = getRequestURL(event);
  const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;

  // Register the dev account (no-op if already exists)
  await fetch(`${baseUrl}${REGISTER_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD, name: "Owner" }),
  }).catch(() => {});

  // Sign in — capture the full response so we can forward the an_session cookie
  const response = await fetch(`${baseUrl}${LOGIN_URL}`, {
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
