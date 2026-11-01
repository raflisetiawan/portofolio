<script setup lang="ts">
import { experience } from "../../data/experience";
import ExperienceItem from "../ui/ExperienceItem.vue";
import SectionHeading from "../ui/SectionHeading.vue";
</script>

<template>
  <section id="experience" aria-labelledby="experience-title" class="scroll-mt-16">
    <SectionHeading id="experience-title" index="02" title="Experience" />
    <ol class="dim-list ml-1 border-l border-line">
      <ExperienceItem
        v-for="item in experience"
        :key="`${item.company}-${item.period}`"
        :item="item"
      />
    </ol>
  </section>
</template>
