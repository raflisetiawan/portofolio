<script setup lang="ts">
import ChatLauncher from "./components/chat/ChatLauncher.vue";
import MobileNav from "./components/layout/MobileNav.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";
import SiteSidebar from "./components/layout/SiteSidebar.vue";
import AboutSection from "./components/sections/AboutSection.vue";
import ContactSection from "./components/sections/ContactSection.vue";
import EducationSection from "./components/sections/EducationSection.vue";
import ExperienceSection from "./components/sections/ExperienceSection.vue";
import ProjectsSection from "./components/sections/ProjectsSection.vue";
import { useScrollSpy } from "./composables/useScrollSpy";
import { navItems } from "./data/navigation";

const activeId = useScrollSpy(navItems.map((item) => item.id));
</script>

<template>
  <a
    href="#content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-canvas"
  >
    Skip to content
  </a>
  <div class="mx-auto max-w-6xl px-6 md:px-12 lg:flex lg:gap-12 lg:px-16">
    <SiteSidebar :active-id="activeId" />
    <MobileNav :items="navItems" :active-id="activeId" />
    <div class="lg:w-7/12">
      <main id="content" tabindex="-1" class="space-y-20 pt-12 outline-none lg:pt-16">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  </div>
  <ChatLauncher />
</template>
