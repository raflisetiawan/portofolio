<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import { MAX_MESSAGE_LENGTH, useChat } from "../../composables/useChat";
import { profile } from "../../data/profile";
import BaseIcon from "../ui/BaseIcon.vue";

const emit = defineEmits<{ close: [] }>();

const suggestions = [
  "What does Rafli work on now?",
  "Which projects has Rafli built?",
  "Is Rafli open to freelance work?",
];

const { messages, pending, error, send } = useChat();
const draft = ref("");
const log = useTemplateRef("log");
const input = useTemplateRef("input");

async function submit(text: string) {
  const previous = draft.value;
  draft.value = "";
  const answered = await send(text);
  if (!answered) draft.value = text || previous;
  input.value?.focus();
}

watch([() => messages.value.length, pending, error], async () => {
  await nextTick();
  log.value?.scrollTo({ top: log.value.scrollHeight });
});

onMounted(() => input.value?.focus());
</script>

<template>
  <section
    role="dialog"
    aria-label="Chat with the portfolio assistant"
    class="fixed inset-x-3 bottom-3 z-30 flex max-h-[85dvh] flex-col rounded-xl border border-line bg-surface shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[32rem] sm:w-96"
    @keydown.esc="emit('close')"
  >
    <header class="flex items-center justify-between border-b border-line py-1 pr-1 pl-4">
      <h2 class="font-semibold text-ink">Ask about {{ profile.name }}</h2>
      <button
        type="button"
        class="flex size-11 items-center justify-center text-muted transition-colors hover:text-accent"
        aria-label="Close chat"
        @click="emit('close')"
      >
        <BaseIcon name="close" />
      </button>
    </header>

    <div
      ref="log"
      role="log"
      aria-live="polite"
      tabindex="0"
      aria-label="Conversation"
      class="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm leading-relaxed"
    >
      <p class="self-start rounded-lg bg-canvas px-3 py-2">
        Hi! I can answer questions about {{ profile.name }}'s experience, projects, and skills.
      </p>

      <ul v-if="!messages.length" class="flex flex-col items-start gap-2">
        <li v-for="suggestion in suggestions" :key="suggestion">
          <button
            type="button"
            class="min-h-9 rounded-md border border-line px-3 py-1 text-left text-accent transition-colors hover:bg-accent-soft"
            :disabled="pending"
            @click="submit(suggestion)"
          >
            {{ suggestion }}
          </button>
        </li>
      </ul>

      <!-- Rendered as text, never as HTML, so a reply cannot inject markup. -->
      <p
        v-for="(message, index) in messages"
        :key="index"
        class="max-w-[85%] rounded-lg px-3 py-2 break-words"
        :class="message.role === 'user' ? 'self-end bg-accent text-canvas' : 'self-start bg-canvas'"
      >
        <span class="sr-only">{{ message.role === "user" ? "You:" : "Assistant:" }}</span>
        <span class="whitespace-pre-wrap">{{ message.text }}</span>
      </p>

      <p v-if="pending" class="self-start rounded-lg bg-canvas px-3 py-2">Thinking…</p>
      <p v-if="error" role="alert" class="rounded-lg border border-line px-3 py-2 text-ink">
        {{ error }}
      </p>
    </div>

    <form class="border-t border-line p-3" @submit.prevent="submit(draft)">
      <div class="flex items-center gap-2">
        <label for="chat-input" class="sr-only">Your question</label>
        <input
          id="chat-input"
          ref="input"
          v-model="draft"
          type="text"
          autocomplete="off"
          :maxlength="MAX_MESSAGE_LENGTH"
          placeholder="Ask a question"
          class="h-11 min-w-0 flex-1 rounded-md border border-line bg-canvas px-3 text-base text-ink placeholder:text-muted sm:text-sm"
        />
        <button
          type="submit"
          class="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-canvas transition-opacity disabled:opacity-50"
          aria-label="Send message"
          :disabled="pending || !draft.trim()"
        >
          <BaseIcon name="send" />
        </button>
      </div>
      <p class="mt-2 text-xs leading-snug">
        AI assistant powered by Google Gemini. It can make mistakes. Please don't share personal or
        sensitive information.
      </p>
    </form>
  </section>
</template>
