<script setup lang="ts">
import { useTheme } from "../../composables/useTheme";
import BaseIcon from "../ui/BaseIcon.vue";

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <button
    type="button"
    class="flex size-11 items-center justify-center text-muted transition-colors hover:text-accent"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <BaseIcon :name="theme === 'dark' ? 'sun' : 'moon'" />
  </button>
</template>
