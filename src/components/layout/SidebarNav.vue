<script setup lang="ts">
import { computed } from "vue";
import type { NavItem } from "../../types";

const props = defineProps<{ items: NavItem[]; activeId: string | null }>();

// How far along the line the accent has travelled, up to the active node.
const progress = computed(() => {
  const index = props.items.findIndex((item) => item.id === props.activeId);
  return index > 0 ? (index / (props.items.length - 1)) * 100 : 0;
});
</script>

<template>
  <nav aria-label="Sections">
    <div class="relative">
      <div class="absolute top-5 bottom-5 left-1 w-px bg-line" aria-hidden="true">
        <div
          class="w-full bg-accent transition-[height] duration-300"
          :style="{ height: `${progress}%` }"
        ></div>
      </div>
      <ul>
        <li v-for="(item, index) in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            :aria-current="item.id === activeId ? 'location' : undefined"
            class="group relative flex h-10 items-center gap-4 text-sm transition-colors hover:text-ink"
            :class="item.id === activeId ? 'font-medium text-ink' : 'text-muted'"
          >
            <span
              class="size-[9px] shrink-0 rounded-full border transition-all"
              :class="
                item.id === activeId
                  ? 'scale-125 border-accent bg-accent'
                  : 'border-muted bg-canvas group-hover:border-accent'
              "
              aria-hidden="true"
            ></span>
            <span
              class="font-mono text-xs"
              :class="item.id === activeId ? 'text-accent' : ''"
              aria-hidden="true"
            >
              0{{ index + 1 }}
            </span>
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
