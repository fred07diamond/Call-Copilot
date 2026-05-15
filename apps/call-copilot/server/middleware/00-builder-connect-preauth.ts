/**
 * Pre-auth bridge for the Builder connect popup.
 *
 * Problem: the Builder connect popup opens at the public Fusion URL
 * (e.g. https://<env>.builderio.xyz/_agent-native/builder/connect?_an_connect=<token>)
 * but the user's session cookie was issued for the localhost domain inside the
 * Builder preview iframe. The popup has no cookie → auth guard returns 401.
 *
 * Solution: the _an_connect query parameter is a short-lived HMAC-signed token
 * that proves the requesting user is authenticated (it's minted by the status
 * endpoint which requires auth). We verify it here, mint a new legacy session
 * for the domain the popup actually hit, set the cookie, and redirect to the
 * same URL so the subsequent request carries the cookie and passes auth.
 *
 * This middleware must run BEFORE server/middleware/auth.ts (ensured by the
 * "00-" filename prefix which sorts before "a" alphabetically).
 */
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import {
  defineEventHandler,
  getCookie,
  setCookie,
  sendRedirect,
  getQuery,
  getRequestURL,
} from "h3";
import { addSession } from "@agent-native/core/server";

const BUILDER_CONNECT_SUFFIX = "/_agent-native/builder/connect";
const CONNECT_PARAM = "_an_connect";
const SESSION_COOKIE = "an_session_workspace";
// Must match the framework's BUILDER_STATE_TTL_MS (5 minutes)
const TOKEN_TTL_MS = 5 * 60 * 1000;

function extractEmailFromConnectToken(token: string): string | null {
  if (typeof token !== "string" || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 4) return null;

  const [nonce, emailEncoded, tsStr, mac] = parts;
  if (!nonce || !emailEncoded || !tsStr || !mac) return null;

  let email: string;
  try {
    email = Buffer.from(emailEncoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!email || !email.includes("@")) return null;

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return null;
  if (Math.abs(Date.now() - ts) > TOKEN_TTL_MS) return null;

  // Verify HMAC — same algorithm as framework's signEmailBoundBuilderToken
  const secret = process.env.BETTER_AUTH_SECRET ?? "";
  const signingKey = `builder-connect:${secret}`;
  const expected = createHmac("sha256", signingKey)
    .update(`${nonce}.${emailEncoded}.${ts}`)
    .digest("base64url");

  const expectedBuf = Buffer.from(expected, "utf8");
  const candidateBuf = Buffer.from(mac, "utf8");
  if (expectedBuf.length !== candidateBuf.length) return null;

  try {
    return timingSafeEqual(expectedBuf, candidateBuf) ? email : null;
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const path = event.path?.split("?")[0] ?? "";
  // Match both bare path and path with APP_BASE_PATH prefix (e.g. /call-copilot).
  if (!path.endsWith(BUILDER_CONNECT_SUFFIX)) return;

  // If a session cookie already exists, no need to bootstrap one
  if (getCookie(event, SESSION_COOKIE)) return;

  const query = getQuery(event);
  const connectToken =
    typeof query[CONNECT_PARAM] === "string"
      ? (query[CONNECT_PARAM] as string)
      : null;
  if (!connectToken) return;

  const email = extractEmailFromConnectToken(connectToken);
  if (!email) return;

  // Mint a new legacy session token for this email
  const sessionToken = randomBytes(24).toString("base64url");
  await addSession(sessionToken, email);

  // Determine whether the request arrived over HTTPS (Fusion cloud) or plain
  // HTTP (local dev). SameSite=None requires Secure; on localhost we fall back
  // to SameSite=Lax so the cookie is actually stored and sent on the redirect.
  const requestUrl = getRequestURL(event);
  const isSecure =
    requestUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production";

  setCookie(event, SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: isSecure ? "none" : "lax",
    secure: isSecure,
    ...(isSecure ? { partitioned: true } : {}),
    path: "/",
    maxAge: 300, // 5 min — enough to complete the connect flow
  });

  // Redirect to the same path+query. The browser will re-issue the request
  // with the new cookie, and the auth guard will succeed.
  const search = event.url?.search ?? `?${CONNECT_PARAM}=${connectToken}`;
  return sendRedirect(event, `${path}${search}`, 302);
});
