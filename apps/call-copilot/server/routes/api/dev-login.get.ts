import { defineEventHandler, sendRedirect } from "h3";
import { addSession, setFrameworkSessionCookie } from "@agent-native/core/server";
import { getBetterAuth } from "@agent-native/core/dist/server/better-auth-instance.js";

const DEV_EMAIL = "owner@call-copilot.local";
const DEV_PASSWORD = "callcopilot-dev-2024!";

export default defineEventHandler(async (event) => {
  const auth = await getBetterAuth();

  // Register (no-op if already exists)
  try {
    await auth.api.signUpEmail({
      body: { email: DEV_EMAIL, password: DEV_PASSWORD, name: "Owner" },
    });
  } catch {
    // User already exists — continue to sign in
  }

  // Sign in to get a session token
  const result = await auth.api.signInEmail({
    body: { email: DEV_EMAIL, password: DEV_PASSWORD },
  });

  if (result?.token) {
    setFrameworkSessionCookie(event, result.token);
    await addSession(result.token, DEV_EMAIL);
  }

  return sendRedirect(event, "/");
});
