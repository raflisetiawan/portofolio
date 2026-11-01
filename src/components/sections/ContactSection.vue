<script setup lang="ts">
import { profile } from "../../data/profile";
import { socials } from "../../data/socials";
import BaseIcon from "../ui/BaseIcon.vue";
import SectionHeading from "../ui/SectionHeading.vue";
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="scroll-mt-16">
    <SectionHeading id="contact-title" index="05" title="Contact" />
    <p class="leading-relaxed">{{ profile.contactIntro }}</p>
    <ul class="mt-4">
      <li v-for="social in socials" :key="social.label">
        <a
          :href="social.href"
          :target="social.href.startsWith('http') ? '_blank' : undefined"
          :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="flex min-h-11 items-center gap-3 text-ink transition-colors hover:text-accent"
        >
          <BaseIcon :name="social.icon" class="text-accent" />
          <span class="sr-only">{{ social.label }}:</span>
          <span class="min-w-0 text-sm break-words sm:text-base">{{ social.display }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>
