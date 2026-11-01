import type { IncomingMessage, ServerResponse } from "node:http";
import { handleChat } from "./chat.ts";

const MAX_BODY_BYTES = 64 * 1024;

/** Bridges a Node HTTP request to handleChat. Used by the VPS server and by `vp dev`. */
export async function serveChat(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string | undefined,
): Promise<void> {
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req as AsyncIterable<Buffer>) {
      size += chunk.length;
      if (size <= MAX_BODY_BYTES) chunks.push(chunk);
    }
    if (size > MAX_BODY_BYTES) {
      res.statusCode = 413;
      res.end();
      return;
    }

    // These headers are set by Nginx, which is the only way to reach the VPS server.
    const headers = new Headers();
    if (req.headers.origin) headers.set("origin", req.headers.origin);
    const client = req.headers["x-forwarded-for"];
    if (typeof client === "string") headers.set("x-forwarded-for", client);
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";

    const response = await handleChat(
      new Request(`${protocol}://${req.headers.host}/api/chat`, {
        method: req.method,
        headers,
        body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
      }),
      apiKey,
    );

    res.statusCode = response.status;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.end(await response.text());
  } catch (error) {
    console.error("Chat request failed", error instanceof Error ? error.name : "");
    res.statusCode = 500;
    res.end();
  }
}
