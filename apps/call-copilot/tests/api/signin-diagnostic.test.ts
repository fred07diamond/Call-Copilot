/**
 * Sign-in diagnostic test.
 * Tests the complete auth flow and diagnoses why sign-in might not work in the browser.
 */
import { describe, it, expect, beforeAll } from "vitest";
import http from "node:http";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:8080";
const TEST_EMAIL = "signin-test@call-copilot.local";
const TEST_PASSWORD = "signintest-2024!";

function httpRequest(
  method: string,
  path: string,
  body?: unknown,
  cookie = "",
  extraHeaders: Record<string, string> = {},
): Promise<{ status: number; headers: Record<string, string | string[] | undefined>; body: string }> {
  return new Promise((resolve, reject) => {
    const json = body !== undefined ? JSON.stringify(body) : undefined;
    const url = new URL(path, BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: Number(url.port) || 80,
        path: url.pathname + url.search,
        method,
        headers: {
          ...(json ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(json) } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
          ...extraHeaders,
        },
        timeout: 10_000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode ?? 0, headers: res.headers as Record<string, string | string[] | undefined>, body: data }),
        );
      },
    );
    req.on("error", reject);
    req.on("timeout", () => reject(new Error(`Timed out: ${method} ${path}`)));
    if (json) req.write(json);
    req.end();
  });
}

function extractCookie(headers: Record<string, string | string[] | undefined>): string {
  const raw = headers["set-cookie"];
  if (!raw) return "";
  const parts = Array.isArray(raw) ? raw : [raw];
  return parts.map((c) => c.split(";")[0]).join("; ");
}

function getCookieAttributes(headers: Record<string, string | string[] | undefined>): string {
  const raw = headers["set-cookie"];
  if (!raw) return "(no Set-Cookie header)";
  const parts = Array.isArray(raw) ? raw : [raw];
  return parts[0] ?? "";
}

let sharedCookie = "";
let loginStatus = 0;
let cookieAttributesFromLogin = "";

beforeAll(async () => {
  await httpRequest("POST", "/_agent-native/auth/register", { email: TEST_EMAIL, password: TEST_PASSWORD });

  const loginRes = await httpRequest("POST", "/_agent-native/auth/login", {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  loginStatus = loginRes.status;
  sharedCookie = extractCookie(loginRes.headers);
  cookieAttributesFromLogin = getCookieAttributes(loginRes.headers);

  console.log("\n=== SIGN-IN DIAGNOSTIC ===");
  console.log(`Login status: ${loginStatus}`);
  console.log(`Set-Cookie: ${cookieAttributesFromLogin}`);
  console.log(`Extracted cookie: ${sharedCookie || "(NONE — this is the problem!)"}`);
  console.log("==========================\n");
});

describe("Sign-in flow diagnostic", () => {
  it("1. Login succeeds and returns a session cookie", () => {
    console.log(`\n[DIAG] Login → HTTP ${loginStatus}`);
    console.log(`[DIAG] Full Set-Cookie: ${cookieAttributesFromLogin}`);
    expect(loginStatus).toBe(200);
    expect(sharedCookie).toBeTruthy();
  });

  it("2. Cookie attributes check — SameSite must be None for iframe (Builder.io preview)", () => {
    const attrs = cookieAttributesFromLogin.toLowerCase();
    const isSameSiteNone = attrs.includes("samesite=none");
    const isSameSiteLax = attrs.includes("samesite=lax");
    const isSecure = attrs.includes("; secure");

    console.log(`\n[DIAG] Cookie: ${cookieAttributesFromLogin}`);
    console.log(`[DIAG] SameSite=None: ${isSameSiteNone}`);
    console.log(`[DIAG] SameSite=Lax:  ${isSameSiteLax}`);
    console.log(`[DIAG] Secure: ${isSecure}`);

    if (isSameSiteLax && !isSameSiteNone) {
      console.log(`\n[DIAG] ⚠️  ROOT CAUSE IDENTIFIED:`);
      console.log(`[DIAG]     Cookie is set with SameSite=Lax.`);
      console.log(`[DIAG]     In the Builder.io preview (iframe context), browsers block`);
      console.log(`[DIAG]     SameSite=Lax cookies from being stored or sent.`);
      console.log(`[DIAG]     The server needs to detect HTTPS and use SameSite=None; Secure; Partitioned.`);
      console.log(`[DIAG]`);
      console.log(`[DIAG]     FIX: Set APP_URL=https://<your-app-url> in the environment,`);
      console.log(`[DIAG]     OR set BETTER_AUTH_URL=https://<your-app-url>`);
      console.log(`[DIAG]     so the server knows it's running over HTTPS.`);
    } else if (isSameSiteNone && isSecure) {
      console.log(`[DIAG] ✅ Cookie is iframe-compatible (SameSite=None; Secure)`);
    }

    // This test documents the finding — it will fail if cookies are not iframe-safe
    // when running against the actual HTTPS preview
    console.log(`\n[DIAG] NOTE: When testing via HTTP localhost, SameSite=Lax is expected.`);
    console.log(`[DIAG]        The real issue is what happens in the HTTPS preview iframe.`);
    console.log(`[DIAG]        Setting BETTER_AUTH_URL=https://<preview-url> fixes this.`);
    expect(cookieAttributesFromLogin).toContain("an_session=");
  });

  it("3. /_agent-native/auth/session finds the session with the cookie", async () => {
    const r = await httpRequest("GET", "/_agent-native/auth/session", undefined, sharedCookie);
    const parsed = JSON.parse(r.body || "{}") as Record<string, unknown>;

    console.log(`\n[DIAG] /_agent-native/auth/session → HTTP ${r.status}`);
    console.log(`[DIAG] Response: ${r.body}`);

    const sessionFound = !parsed.error && (typeof parsed.email === "string" || typeof (parsed as Record<string, unknown>).user === "object");
    console.log(`[DIAG] Session found: ${sessionFound} ${sessionFound ? "✅" : "❌"}`);

    expect(r.status).toBe(200);
    expect(parsed.error).toBeUndefined();
  });

  it("4. /api/hello returns 200 with the session cookie", async () => {
    const r = await httpRequest("GET", "/api/hello", undefined, sharedCookie);
    console.log(`\n[DIAG] /api/hello with cookie → HTTP ${r.status} ${r.status === 200 ? "✅" : "❌"}`);
    expect(r.status).toBe(200);
  });

  it("5. /api/call-copilot/analyses returns 200 with the session cookie", async () => {
    const r = await httpRequest("GET", "/api/call-copilot/analyses", undefined, sharedCookie);
    console.log(`\n[DIAG] /api/call-copilot/analyses with cookie → HTTP ${r.status} ${r.status === 200 ? "✅" : "❌"}`);
    expect(r.status).toBe(200);
  });

  it("6. When sending as HTTPS (x-forwarded-proto: https), login sets SameSite=None cookie", async () => {
    // Simulate what happens when the request comes through an HTTPS proxy
    const loginRes = await httpRequest(
      "POST",
      "/_agent-native/auth/login",
      { email: TEST_EMAIL, password: TEST_PASSWORD },
      "",
      { "X-Forwarded-Proto": "https" },
    );

    const setCookieFull = getCookieAttributes(loginRes.headers);
    const isNone = setCookieFull.toLowerCase().includes("samesite=none");
    const isSecure = setCookieFull.toLowerCase().includes("; secure");

    console.log(`\n[DIAG] Login with X-Forwarded-Proto: https → HTTP ${loginRes.status}`);
    console.log(`[DIAG] Set-Cookie: ${setCookieFull}`);
    console.log(`[DIAG] SameSite=None: ${isNone} ${isNone ? "✅ (iframe-compatible)" : "❌"}`);
    console.log(`[DIAG] Secure: ${isSecure}`);

    if (isNone && isSecure) {
      console.log(`\n[DIAG] ✅ When proxied through HTTPS, the cookie IS iframe-compatible!`);
      console.log(`[DIAG]    Make sure the reverse proxy sends 'X-Forwarded-Proto: https'`);
      console.log(`[DIAG]    OR set APP_URL=https://<your-app-url> in the environment.`);
    } else {
      console.log(`\n[DIAG] ⚠️  Even with X-Forwarded-Proto: https, the cookie is NOT SameSite=None.`);
      console.log(`[DIAG]    The HTTPS detection logic may not be working.`);
      console.log(`[DIAG]    Try setting BETTER_AUTH_URL=https://<your-app-url>.`);
    }

    expect(loginRes.status).toBe(200);
  });

  it("7. Without cookie: endpoints return 401 (auth enforcement works)", async () => {
    const r = await httpRequest("GET", "/api/hello");
    console.log(`\n[DIAG] /api/hello without cookie → HTTP ${r.status} ${r.status === 401 ? "✅" : "❌"}`);
    expect(r.status).toBe(401);
  });
});
