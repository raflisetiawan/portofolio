<script setup lang="ts">
import type { Experience } from "../../types";
import TagList from "./TagList.vue";

defineProps<{ item: Experience }>();
</script>

<template>
  <li class="group relative pb-4 pl-6 last:pb-0">
    <!-- Pipeline node on the timeline line -->
    <span
      class="absolute top-6.5 -left-[5px] size-[9px] rounded-full border transition-colors"
      :class="
        item.current
          ? 'border-accent bg-accent'
          : 'border-muted bg-canvas group-hover:border-accent group-hover:bg-accent'
      "
      aria-hidden="true"
    ></span>

    <article
      class="rounded-lg border border-transparent p-4 transition-colors group-hover:border-line group-hover:bg-surface"
    >
      <p class="font-mono text-xs text-muted">{{ item.period }}</p>
      <h3 class="mt-2 font-semibold text-ink">
        {{ item.role }}
        <span class="font-normal text-accent">· {{ item.company }}</span>
      </h3>
      <ul class="mt-3 list-disc space-y-2 pl-4 text-[0.9375rem] leading-relaxed marker:text-line">
        <li v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</li>
      </ul>
      <p v-if="item.note" class="mt-3 text-sm italic">{{ item.note }}</p>
      <TagList class="mt-4" :tags="item.tags" :label="`Tools used at ${item.company}`" />
    </article>
  </li>
</template>
