import { createAuthPlugin } from "@agent-native/core/server";

// /api/dev-login must be public so unauthenticated users can bootstrap a
// session without hitting the auth guard at the framework middleware level.
const PUBLIC_PATHS = ["/api/dev-login", "/api/auth-debug"];

export default createAuthPlugin({ publicPaths: PUBLIC_PATHS });
