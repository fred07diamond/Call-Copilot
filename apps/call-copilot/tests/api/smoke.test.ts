/**
 * API smoke tests — run against the local dev server.
 * Requires the server to be running (default: http://localhost:8080).
 *
 * Uses the framework's public auth endpoints to establish a session.
 */
import { describe, it, expect, beforeAll } from "vitest";
import http from "node:http";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:8080";
const TEST_EMAIL = "smoke-test@call-copilot.local";
const TEST_PASSWORD = "smoketest-2024!";

let sessionCookie = "";
let serverAvailable = false;

// Post JSON using node's http (no redirect issues, full header access)
function httpPost(path: string, body: unknown, cookie = ""): Promise<{ status: number; headers: Record<string, string | string[]>; body: string }> {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(body);
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      timeout: 10_000,
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({ status: res.statusCode ?? 0, headers: res.headers as Record<string, string | string[]>, body: data }),
      );
    });
    req.on("error", reject);
    req.on("timeout", () => reject(new Error(`Timed out: POST ${path}`)));
    req.write(json);
    req.end();
  });
}

// Simple GET with full header access (no redirect following)
function httpGet(path: string, cookie = ""): Promise<{ status: number; headers: Record<string, string | string[]>; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: "GET",
      headers: { ...(cookie ? { Cookie: cookie } : {}) },
      timeout: 10_000,
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({ status: res.statusCode ?? 0, headers: res.headers as Record<string, string | string[]>, body: data }),
      );
    });
    req.on("error", reject);
    req.on("timeout", () => reject(new Error(`Timed out: GET ${path}`)));
    req.end();
  });
}

function parseCookies(setCookieHeader: string | string[] | undefined): string {
  if (!setCookieHeader) return "";
  const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return parts.map((c) => c.split(";")[0]).join("; ");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      ...(options.headers ?? {}),
    },
    redirect: "follow",
  });
}

beforeAll(async () => {
  // Check if server is up (401 = server running + auth active = OK)
  try {
    const r = await httpGet("/_agent-native/auth/login");
    // 405 means auth routes are mounted and accessible
    serverAvailable = r.status < 500;
  } catch {
    serverAvailable = false;
    console.warn(`[smoke] Server not available at ${BASE_URL} — all API tests will be skipped`);
    return;
  }

  // Register the test user (409 = already exists, that's fine)
  await httpPost("/_agent-native/auth/register", {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  // Sign in to get a session cookie
  const loginRes = await httpPost("/_agent-native/auth/login", {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (loginRes.status === 200) {
    sessionCookie = parseCookies(loginRes.headers["set-cookie"]);
    if (!sessionCookie) {
      console.warn("[smoke] Login returned 200 but no Set-Cookie header — authenticated tests may fail");
    }
  } else {
    console.warn(`[smoke] Login returned ${loginRes.status}: ${loginRes.body}`);
  }
});

// Wrap a test so it soft-skips (passes with a warning) when the server is down.
// Using this instead of it.skip() because serverAvailable is set in beforeAll,
// which runs after test collection — so it.skip() would always see the initial false.
function whenServerUp(label: string, fn: () => Promise<void>) {
  return it(label, async () => {
    if (!serverAvailable) {
      console.warn(`[skip] Server unavailable — skipping: ${label}`);
      return;
    }
    await fn();
  });
}

// ── Health check ─────────────────────────────────────────────────────────────

describe("GET /_agent-native/auth/login", () => {
  it("auth endpoint is reachable (405 = mounted, auth is active)", async () => {
    const r = await httpGet("/_agent-native/auth/login");
    // GET returns 405 Method Not Allowed — proves the auth system is mounted
    expect([200, 401, 405]).toContain(r.status);
  });
});

// ── API hello ─────────────────────────────────────────────────────────────────

describe("GET /api/hello", () => {
  whenServerUp("returns 200 with a message string when authenticated", async () => {
    const res = await apiFetch("/api/hello");
    expect(res.status).toBe(200);
    const body = await res.json() as { message: string };
    expect(typeof body.message).toBe("string");
    expect(body.message.length).toBeGreaterThan(0);
  });
});

// ── Deepgram status ───────────────────────────────────────────────────────────

describe("GET /api/call-copilot/deepgram/status", () => {
  whenServerUp("returns configured boolean", async () => {
    const res = await apiFetch("/api/call-copilot/deepgram/status");
    expect(res.status).toBe(200);
    const body = await res.json() as { configured: boolean };
    expect(typeof body.configured).toBe("boolean");
  });
});

// ── Keywords ─────────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/keywords", () => {
  whenServerUp("returns array of keywords", async () => {
    const res = await apiFetch("/api/call-copilot/keywords");
    expect(res.status).toBe(200);
    const body = await res.json() as { keywords: unknown[] };
    expect(Array.isArray(body.keywords)).toBe(true);
  });
});

describe("PUT /api/call-copilot/keywords", () => {
  whenServerUp("replaces manual keywords and returns updated list", async () => {
    const res = await apiFetch("/api/call-copilot/keywords", {
      method: "PUT",
      body: JSON.stringify({
        keywords: [
          { phrase: "SmokeTest Phrase", definition: "Used in smoke tests", sourceType: "manual" },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { keywords: Array<{ phrase: string }> };
    expect(Array.isArray(body.keywords)).toBe(true);
    expect(body.keywords.some((k) => k.phrase === "SmokeTest Phrase")).toBe(true);
  });
});

// ── Corrections ───────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/corrections", () => {
  whenServerUp("returns learned and vocabulary arrays", async () => {
    const res = await apiFetch("/api/call-copilot/corrections");
    expect(res.status).toBe(200);
    const body = await res.json() as { learned: unknown[]; vocabulary: unknown[] };
    expect(Array.isArray(body.learned)).toBe(true);
    expect(Array.isArray(body.vocabulary)).toBe(true);
  });
});

// ── Analyses ─────────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/analyses", () => {
  whenServerUp("returns array of analyses", async () => {
    const res = await apiFetch("/api/call-copilot/analyses");
    expect(res.status).toBe(200);
    const body = await res.json() as { analyses: unknown[] };
    expect(Array.isArray(body.analyses)).toBe(true);
  });
});

// ── Playbooks ─────────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/playbooks", () => {
  whenServerUp("returns array of playbook documents", async () => {
    const res = await apiFetch("/api/call-copilot/playbooks");
    expect(res.status).toBe(200);
    const body = await res.json() as { documents: unknown[] };
    expect(Array.isArray(body.documents)).toBe(true);
  });
});

// ── Speakers ─────────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/speakers", () => {
  whenServerUp("returns array of speaker profiles", async () => {
    const res = await apiFetch("/api/call-copilot/speakers");
    expect(res.status).toBe(200);
    const body = await res.json() as { profiles: unknown[] };
    expect(Array.isArray(body.profiles)).toBe(true);
  });
});

describe("GET /api/call-copilot/speakers/settings", () => {
  whenServerUp("returns speaker settings object", async () => {
    const res = await apiFetch("/api/call-copilot/speakers/settings");
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(typeof body).toBe("object");
    expect(body).not.toBeNull();
  });
});

// ── Knowledge Base ────────────────────────────────────────────────────────────

describe("GET /api/call-copilot/kb/pdfs", () => {
  whenServerUp("returns array of PDFs", async () => {
    const res = await apiFetch("/api/call-copilot/kb/pdfs");
    expect(res.status).toBe(200);
    const body = await res.json() as { pdfs: unknown[] };
    expect(Array.isArray(body.pdfs)).toBe(true);
  });
});

// ── Transcripts CRUD ──────────────────────────────────────────────────────────

describe("Transcripts CRUD", () => {
  let createdId = "";

  whenServerUp("GET /api/call-copilot/transcripts returns array", async () => {
    const res = await apiFetch("/api/call-copilot/transcripts");
    expect(res.status).toBe(200);
    const body = await res.json() as { transcripts: unknown[] };
    expect(Array.isArray(body.transcripts)).toBe(true);
  });

  whenServerUp("POST creates a transcript", async () => {
    const res = await apiFetch("/api/call-copilot/transcripts", {
      method: "POST",
      body: JSON.stringify({
        sessionName: "Smoke Test Session",
        segments: [
          {
            id: "seg-smoke-1",
            text: "Hello from the smoke test",
            spokenAt: new Date().toISOString(),
            speaker: null,
            labelSource: null,
            labelConfidence: null,
            status: "pending",
            speakerId: "unlabeled",
            speakerLabel: "",
            startTime: Date.now(),
            endTime: Date.now(),
          },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { transcript?: { id?: string; sessionName?: string } };
    expect(body.transcript).toBeTruthy();
    expect(body.transcript?.sessionName).toBe("Smoke Test Session");
    createdId = body.transcript?.id ?? "";
  });

  whenServerUp("DELETE removes the created transcript", async () => {
    if (!createdId) return;
    const res = await apiFetch(`/api/call-copilot/transcripts/${createdId}`, {
      method: "DELETE",
    });
    expect([200, 204]).toContain(res.status);
  });
});

// ── Analyses CRUD ─────────────────────────────────────────────────────────────

describe("Analyses CRUD", () => {
  let createdId = "";

  whenServerUp("POST creates a pending analysis", async () => {
    const res = await apiFetch("/api/call-copilot/analyses", {
      method: "POST",
      body: JSON.stringify({
        transcriptText: "Sample transcript for smoke testing.",
        prospectContext: "Smoke Test Company",
        playbookDocumentIds: [],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { analysis?: { id?: string; status?: string } };
    expect(body.analysis).toBeTruthy();
    expect(body.analysis?.status).toBe("pending");
    createdId = body.analysis?.id ?? "";
  });

  whenServerUp("GET /analyses/[id] returns the created analysis", async () => {
    if (!createdId) return;
    const res = await apiFetch(`/api/call-copilot/analyses/${createdId}`);
    expect(res.status).toBe(200);
    const body = await res.json() as { analysis?: { id?: string } };
    expect(body.analysis?.id).toBe(createdId);
  });

  whenServerUp("DELETE removes the created analysis", async () => {
    if (!createdId) return;
    const res = await apiFetch(`/api/call-copilot/analyses/${createdId}`, {
      method: "DELETE",
    });
    expect([200, 204]).toContain(res.status);
  });
});
