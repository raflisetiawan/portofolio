import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it, vi } from "vite-plus/test";
import { serveChat } from "./nodeAdapter.ts";

const valid = JSON.stringify({ messages: [{ role: "user", text: "Hi" }] });

describe("serveChat", () => {
  let server: Server;
  let url: string;
  let host: string;

  beforeAll(async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    // No API key: a request that passes every check ends in 503, without calling Gemini.
    server = createServer((req, res) => void serveChat(req, res, undefined));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    host = `127.0.0.1:${port}`;
    url = `http://${host}/api/chat`;
  });

  afterAll(() => {
    server.close();
    vi.restoreAllMocks();
  });

  const post = (body: string, headers: Record<string, string> = {}) =>
    fetch(url, { method: "POST", body, headers });

  it("rejects other methods", async () => {
    expect((await fetch(url)).status).toBe(405);
  });

  it("rejects an invalid body", async () => {
    expect((await post("not json")).status).toBe(400);
  });

  it("rejects an over-long body", async () => {
    expect((await post("x".repeat(70 * 1024))).status).toBe(413);
  });

  it("uses the forwarded protocol for the same-origin check", async () => {
    const response = await post(valid, {
      origin: `https://${host}`,
      "x-forwarded-proto": "https",
    });
    expect(response.status).toBe(503);
  });

  it("rejects an origin that doesn't match the forwarded protocol", async () => {
    const response = await post(valid, { origin: `http://${host}`, "x-forwarded-proto": "https" });
    expect(response.status).toBe(403);
  });

  it("rejects another site", async () => {
    expect((await post(valid, { origin: "https://evil.test" })).status).toBe(403);
  });
});
