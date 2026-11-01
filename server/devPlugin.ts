import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite-plus";
import { handleChat } from "./chat.ts";

async function serveChat(req: IncomingMessage, res: ServerResponse, apiKey: string | undefined) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);

  const headers = new Headers();
  if (req.headers.origin) headers.set("origin", req.headers.origin);

  const response = await handleChat(
    new Request(`http://${req.headers.host}/api/chat`, {
      method: req.method,
      headers,
      body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
    }),
    apiKey,
  );

  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(await response.text());
}

/** Serves /api/chat locally for `vp dev` and `vp preview`. Vercel uses api/chat.ts instead. */
export function chatApiPlugin(): Plugin {
  let apiKey: string | undefined;

  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split("?")[0] === "/api/chat") void serveChat(req, res, apiKey);
    else next();
  };

  return {
    name: "chat-api",
    configResolved(config) {
      // The empty prefix reads the key on the server only. It is never exposed to client code.
      apiKey = loadEnv(config.mode, config.root, "").PORTFOLIO_GEMINI_API_KEY;
    },
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}
