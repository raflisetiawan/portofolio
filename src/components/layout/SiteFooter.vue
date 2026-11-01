<script setup lang="ts">
import { profile } from "../../data/profile";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-16 border-t border-line pt-6 pb-24 text-sm">
    © {{ year }} {{ profile.name }}. Built with Vue, Tailwind CSS, and Vite+.
  </footer>
</template>
