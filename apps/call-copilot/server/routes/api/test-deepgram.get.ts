import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return {
      error: "No DEEPGRAM_API_KEY found",
      envKeys: Object.keys(process.env).filter((key) => key.includes("DEEP")),
    };
  }

  const res = await fetch("https://api.deepgram.com/v1/projects", {
    headers: { Authorization: `Token ${apiKey}` },
  });
  const data = await res.json();
  return {
    status: res.status,
    keyFound: true,
    keyPrefix: `${apiKey.substring(0, 8)}...`,
    data,
  };
});
