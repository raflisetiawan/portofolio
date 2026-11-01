<script setup lang="ts">
import { socials } from "../../data/socials";
import BaseIcon from "../ui/BaseIcon.vue";
</script>

<template>
  <ul class="flex items-center" aria-label="Social links">
    <li v-for="social in socials" :key="social.label">
      <a
        :href="social.href"
        :target="social.href.startsWith('http') ? '_blank' : undefined"
        :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
        :aria-label="social.label"
        class="flex size-11 items-center justify-center text-muted transition-colors hover:text-accent"
      >
        <BaseIcon :name="social.icon" />
      </a>
    </li>
  </ul>
</template>
