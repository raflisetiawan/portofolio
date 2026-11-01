import { createServer } from "node:http";
import { serveChat } from "./nodeAdapter.ts";

const port = Number(process.env.PORT ?? 3001);
const apiKey = process.env.PORTFOLIO_GEMINI_API_KEY;

if (!apiKey) console.error("PORTFOLIO_GEMINI_API_KEY is not set");

const server = createServer((req, res) => {
  if (req.url?.split("?")[0] === "/api/chat") {
    void serveChat(req, res, apiKey);
    return;
  }
  res.statusCode = 404;
  res.end();
});

// Loopback only: visitors reach this through Nginx.
server.listen(port, "127.0.0.1", () => {
  console.log(`Chat server listening on 127.0.0.1:${port}`);
});
