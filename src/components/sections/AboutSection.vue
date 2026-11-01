<script setup lang="ts">
import { profile } from "../../data/profile";
import SectionHeading from "../ui/SectionHeading.vue";
</script>

<template>
  <section id="about" aria-labelledby="about-title" class="scroll-mt-16">
    <SectionHeading id="about-title" index="01" title="About" />
    <div class="space-y-4 leading-relaxed">
      <p v-for="paragraph in profile.about" :key="paragraph">{{ paragraph }}</p>
    </div>
  </section>
</template>
