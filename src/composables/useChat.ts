import { readonly, ref } from "vue";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export const MAX_MESSAGE_LENGTH = 500;
// Matches the limit in server/chat.ts. Older turns are dropped from the request.
const MAX_HISTORY = 12;

const ERROR_MESSAGES: Record<number, string> = {
  429: "The assistant is getting a lot of questions right now. Please try again in a minute.",
};
const DEFAULT_ERROR = "The assistant is unavailable right now. Please try again, or send an email.";

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const pending = ref(false);
  const error = ref<string | null>(null);

  /** Returns false when the message was not answered, so the caller can keep the text. */
  async function send(text: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH || pending.value) return false;

    error.value = null;
    pending.value = true;
    messages.value.push({ role: "user", text: trimmed });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.value.slice(-MAX_HISTORY) }),
      });
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES[response.status] ?? DEFAULT_ERROR);
      }
      const { reply } = (await response.json()) as { reply: string };
      messages.value.push({ role: "assistant", text: reply });
      return true;
    } catch (cause) {
      messages.value.pop();
      error.value =
        cause instanceof Error && Object.values(ERROR_MESSAGES).includes(cause.message)
          ? cause.message
          : DEFAULT_ERROR;
      return false;
    } finally {
      pending.value = false;
    }
  }

  return { messages: readonly(messages), pending: readonly(pending), error: readonly(error), send };
}
