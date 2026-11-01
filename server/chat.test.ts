import { describe, expect, it, vi } from "vite-plus/test";
import {
  handleChat,
  isRateLimited,
  MAX_MESSAGES,
  MAX_MESSAGE_LENGTH,
  parseMessages,
} from "./chat.ts";

const KEY = "test-key";
const user = (text: string) => ({ role: "user", text });

let clientId = 0;
function chatRequest(body: unknown, headers: Record<string, string> = {}, method = "POST") {
  const init = { method, headers: { "x-forwarded-for": `client-${clientId++}`, ...headers } };
  return new Request(
    "https://example.test/api/chat",
    method === "POST" ? { ...init, body: JSON.stringify(body) } : init,
  );
}

function geminiReply(parts: { text: string; thought?: boolean }[]) {
  return vi.fn(async () => Response.json({ candidates: [{ content: { parts } }] }));
}

describe("parseMessages", () => {
  it("accepts a conversation that ends with the visitor", () => {
    const messages = [user("Hi"), { role: "assistant", text: "Hello" }, user("Skills?")];
    expect(parseMessages({ messages })).toEqual(messages);
  });

  it.each([
    ["no messages key", {}],
    ["an empty list", { messages: [] }],
    ["too many messages", { messages: Array(MAX_MESSAGES + 1).fill(user("Hi")) }],
    ["an unknown role", { messages: [{ role: "system", text: "Hi" }] }],
    ["blank text", { messages: [user("   ")] }],
    ["an over-long visitor message", { messages: [user("x".repeat(MAX_MESSAGE_LENGTH + 1))] }],
    ["a conversation ending with the assistant", { messages: [{ role: "assistant", text: "Hi" }] }],
    ["a null message", { messages: [null] }],
  ])("rejects %s", (_name, body) => {
    expect(parseMessages(body)).toBeNull();
  });
});

describe("isRateLimited", () => {
  it("blocks a client over the limit and resets after the window", () => {
    const start = 1_000_000_000;
    for (let i = 0; i < 15; i++) expect(isRateLimited("a", start)).toBe(false);
    expect(isRateLimited("a", start)).toBe(true);
    expect(isRateLimited("b", start)).toBe(false);
    expect(isRateLimited("a", start + 60_000)).toBe(false);
  });
});

describe("handleChat", () => {
  const valid = { messages: [user("What does Rafli do?")] };

  it("returns the reply without thought parts, and sends the key only in a header", async () => {
    const fetchMock = geminiReply([{ text: "thinking", thought: true }, { text: "An engineer." }]);
    const response = await handleChat(chatRequest(valid), KEY, fetchMock as typeof fetch);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ reply: "An engineer." });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain(KEY);
    expect(init.body).not.toContain(KEY);
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe(KEY);
  });

  it("maps assistant turns to Gemini's model role", async () => {
    const fetchMock = geminiReply([{ text: "Yes." }]);
    const messages = [user("Hi"), { role: "assistant", text: "Hello" }, user("More?")];
    await handleChat(chatRequest({ messages }), KEY, fetchMock as typeof fetch);

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(init.body as string);
    expect(sent.contents.map((c: { role: string }) => c.role)).toEqual(["user", "model", "user"]);
  });

  it("keeps the phone number and confidential terms out of the system prompt", async () => {
    const fetchMock = geminiReply([{ text: "Ok." }]);
    await handleChat(chatRequest(valid), KEY, fetchMock as typeof fetch);

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.body).not.toMatch(/81334388233|Peruri|Kemendikdasmen|Nine-Box/);
  });

  it("rejects non-POST, cross-origin, and invalid requests without calling Gemini", async () => {
    const fetchMock = geminiReply([{ text: "Ok." }]);
    const call = (request: Request) => handleChat(request, KEY, fetchMock as typeof fetch);

    expect((await call(chatRequest(null, {}, "GET"))).status).toBe(405);
    expect((await call(chatRequest(valid, { origin: "https://evil.test" }))).status).toBe(403);
    expect((await call(chatRequest({ messages: [] }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a same-origin request", async () => {
    const fetchMock = geminiReply([{ text: "Ok." }]);
    const request = chatRequest(valid, { origin: "https://example.test" });
    expect((await handleChat(request, KEY, fetchMock as typeof fetch)).status).toBe(200);
  });

  it("responds 503 when the key is missing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleChat(chatRequest(valid), undefined)).status).toBe(503);
  });

  it("does not forward Google's error body", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => new Response("secret details", { status: 500 }));
    const response = await handleChat(chatRequest(valid), KEY, fetchMock as typeof fetch);

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("secret");
  });

  it("passes on Google's rate limit as 429", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => new Response("", { status: 429 }));
    const response = await handleChat(chatRequest(valid), KEY, fetchMock as typeof fetch);
    expect(response.status).toBe(429);
  });

  it("responds 502 when the network call fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      throw new Error("offline");
    });
    const response = await handleChat(chatRequest(valid), KEY, fetchMock as typeof fetch);
    expect(response.status).toBe(502);
  });
});
