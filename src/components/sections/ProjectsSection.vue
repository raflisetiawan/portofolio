<script setup lang="ts">
import { projects } from "../../data/projects";
import ProjectCard from "../ui/ProjectCard.vue";
import SectionHeading from "../ui/SectionHeading.vue";
</script>

<template>
  <section id="projects" aria-labelledby="projects-title" class="scroll-mt-16">
    <SectionHeading id="projects-title" index="03" title="Projects" />
    <ul class="dim-list space-y-4">
      <ProjectCard v-for="project in projects" :key="project.title" :project="project" />
    </ul>
  </section>
</template>
