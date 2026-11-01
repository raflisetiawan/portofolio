<script setup lang="ts">
import type { NavItem } from "../../types";
import ThemeToggle from "./ThemeToggle.vue";

defineProps<{ items: NavItem[]; activeId: string | null }>();
</script>

<template>
  <div
    class="sticky top-0 z-20 -mx-6 border-y border-line bg-canvas px-6 md:-mx-12 md:px-12 lg:hidden"
  >
    <div class="flex items-center justify-between gap-2">
      <nav aria-label="Sections" class="-ml-2">
        <ul class="flex">
          <li v-for="item in items" :key="item.id">
            <a
              :href="`#${item.id}`"
              :aria-current="item.id === activeId ? 'location' : undefined"
              class="flex h-11 items-center border-b-2 px-2 text-sm transition-colors"
              :class="
                item.id === activeId
                  ? 'border-accent font-medium text-ink'
                  : 'border-transparent text-muted'
              "
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
      <ThemeToggle />
    </div>
  </div>
</template>
