<script setup lang="ts">
import { education } from "../../data/education";
import SectionHeading from "../ui/SectionHeading.vue";
</script>

<template>
  <section id="education" aria-labelledby="education-title" class="scroll-mt-16">
    <SectionHeading id="education-title" index="04" title="Education" />
    <ul class="space-y-4">
      <li v-for="item in education" :key="item.degree">
        <p class="font-mono text-xs">{{ item.year }}</p>
        <h3 class="mt-2 font-semibold text-ink">{{ item.degree }}</h3>
        <p class="mt-1">{{ item.school }}</p>
      </li>
    </ul>
  </section>
</template>
