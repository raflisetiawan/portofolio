<script setup lang="ts">
defineProps<{ id: string; index: string; title: string }>();
</script>

<template>
  <div class="mb-8 flex items-center gap-3">
    <span class="font-mono text-sm text-accent" aria-hidden="true">{{ index }}</span>
    <h2 :id="id" class="text-xl font-semibold tracking-tight text-ink">{{ title }}</h2>
    <span class="h-px flex-1 bg-line" aria-hidden="true"></span>
  </div>
</template>
