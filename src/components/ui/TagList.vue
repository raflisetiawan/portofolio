<script setup lang="ts">
import TagChip from "./TagChip.vue";

defineProps<{ tags: string[]; label: string }>();
</script>

<template>
  <ul class="flex flex-wrap gap-2" :aria-label="label">
    <li v-for="tag in tags" :key="tag" class="flex"><TagChip :label="tag" /></li>
  </ul>
</template>
