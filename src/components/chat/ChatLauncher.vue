<script setup lang="ts">
import { defineAsyncComponent, nextTick, ref, useTemplateRef } from "vue";
import BaseIcon from "../ui/BaseIcon.vue";

// Loaded on first open, so visitors who never chat don't pay for it.
const ChatPanel = defineAsyncComponent(() => import("./ChatPanel.vue"));

const opened = ref(false);
const visible = ref(false);
const launcher = useTemplateRef("launcher");

function open() {
  opened.value = true;
  visible.value = true;
}

async function close() {
  visible.value = false;
  await nextTick();
  launcher.value?.focus();
}
</script>

<template>
  <button
    v-show="!visible"
    ref="launcher"
    type="button"
    class="fixed right-4 bottom-4 z-30 flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-canvas shadow-lg transition-transform hover:-translate-y-0.5 sm:right-5 sm:bottom-5"
    aria-haspopup="dialog"
    @click="open"
  >
    <BaseIcon name="chat" />
    Ask AI
  </button>
  <ChatPanel v-if="opened" v-show="visible" @close="close" />
</template>
