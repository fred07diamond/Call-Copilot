import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineNitroPlugin } from "@agent-native/core";

function applyEnvFile(path: string): void {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export default defineNitroPlugin(() => {
  const cwd = process.cwd();
  const envPaths = [
    resolve(cwd, ".env.local"),
    resolve(cwd, ".env"),
    resolve(cwd, "apps/call-copilot/.env.local"),
    resolve(cwd, "apps/call-copilot/.env"),
  ];

  for (const path of envPaths) {
    applyEnvFile(path);
  }

  console.log(
    `[load-app-env] DEEPGRAM_API_KEY configured: ${Boolean(process.env.DEEPGRAM_API_KEY?.trim())}`,
  );
});
