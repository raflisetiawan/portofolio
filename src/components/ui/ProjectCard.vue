<script setup lang="ts">
import type { Project } from "../../types";
import BaseIcon from "./BaseIcon.vue";
import TagList from "./TagList.vue";

defineProps<{ project: Project }>();
</script>

<template>
  <li>
    <article
      class="group relative rounded-lg border p-4 transition-colors hover:bg-surface"
      :class="
        project.placeholder ? 'border-dashed border-line' : 'border-transparent hover:border-line'
      "
    >
      <p class="font-mono text-xs text-muted">{{ project.context }}</p>
      <h3 class="mt-2 font-semibold text-ink">
        <!-- The stretched ::after makes the whole card clickable through one link. -->
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 after:absolute after:inset-0 after:rounded-lg hover:text-accent"
        >
          {{ project.title }}
          <BaseIcon
            name="arrow-up-right"
            class="size-4! transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
          <span class="sr-only">(opens in a new tab)</span>
        </a>
        <template v-else>{{ project.title }}</template>
      </h3>
      <p class="mt-3 text-[0.9375rem] leading-relaxed">{{ project.description }}</p>
      <TagList class="mt-4" :tags="project.tags" :label="`Technologies used in ${project.title}`" />
    </article>
  </li>
</template>
