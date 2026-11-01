<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <span class="rounded bg-accent-soft px-2 py-1 font-mono text-xs leading-none text-accent">
    {{ label }}
  </span>
</template>
