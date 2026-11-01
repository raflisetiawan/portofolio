<script setup lang="ts">
import { navItems } from "../../data/navigation";
import { profile } from "../../data/profile";
import BaseIcon from "../ui/BaseIcon.vue";
import SidebarNav from "./SidebarNav.vue";
import SocialLinks from "./SocialLinks.vue";
import ThemeToggle from "./ThemeToggle.vue";

defineProps<{ activeId: string | null }>();
</script>

<template>
  <header
    class="pt-16 pb-8 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-5/12 lg:flex-col lg:justify-between lg:py-16"
  >
    <div>
      <h1 class="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{{ profile.name }}</h1>
      <p class="mt-3 text-lg font-medium text-accent">{{ profile.role }}</p>
      <p class="mt-4 max-w-sm leading-relaxed">{{ profile.tagline }}</p>
      <a
        :href="profile.cvUrl"
        download
        class="mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-accent px-4 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
      >
        <BaseIcon name="download" class="size-4!" />
        Download CV
      </a>
      <SidebarNav class="mt-10 hidden lg:block" :items="navItems" :active-id="activeId" />
    </div>
    <div class="mt-6 flex items-center lg:mt-8 lg:-ml-3">
      <SocialLinks class="-ml-3 lg:ml-0" />
      <ThemeToggle class="hidden lg:flex" />
    </div>
  </header>
</template>
