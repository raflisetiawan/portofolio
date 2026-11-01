import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite-plus";
import { serveChat } from "./nodeAdapter.ts";

/** Serves /api/chat locally for `vp dev` and `vp preview`. The VPS uses server/standalone.ts. */
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
