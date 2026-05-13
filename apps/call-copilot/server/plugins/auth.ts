import { createAuthPlugin } from "@agent-native/core/server";
import * as workspaceServer from "@my-platform/shared/server";

const workspacePlugin = (workspaceServer as Record<string, unknown>).defaultAuthPlugin;

// /api/dev-login must be public so unauthenticated users (and test runners)
// can call it to bootstrap a session without hitting the auth guard.
const PUBLIC_PATHS = ["/api/dev-login"];

export default typeof workspacePlugin === "function"
  ? workspacePlugin
  : createAuthPlugin({ publicPaths: PUBLIC_PATHS });
