import { onBeforeUnmount, onMounted, readonly, ref } from "vue";

// The active section is decided at a horizontal line in the upper part of the viewport.
const LINE_POSITION = 0.35;
const LINE_ROOT_MARGIN = `-${LINE_POSITION * 100}% 0px -${(1 - LINE_POSITION) * 100}% 0px`;

export interface SectionPosition {
  id: string;
  top: number;
}

/**
 * Returns the last section (in document order) that has started above the line.
 * Working from positions keeps this correct when the page jumps past a section,
 * for example with the End key or a smooth-scroll-free deep link.
 */
export function resolveActiveSection(
  sections: readonly SectionPosition[],
  line: number,
): string | null {
  let active: string | null = null;
  for (const section of sections) {
    if (section.top <= line) active = section.id;
  }
  return active;
}

/** Calls `onChange` whenever a section crosses the line. Returns a function that stops observing. */
export function observeSections(
  ids: readonly string[],
  onChange: (activeId: string | null) => void,
): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const sections = ids
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);

  const observer = new IntersectionObserver(
    () => {
      const positions = sections.map((section) => ({
        id: section.id,
        top: section.getBoundingClientRect().top,
      }));
      onChange(resolveActiveSection(positions, window.innerHeight * LINE_POSITION));
    },
    { rootMargin: LINE_ROOT_MARGIN },
  );

  // Watch every section and <main>, not only `ids`: a jump from the top of the page
  // straight to a section outside `ids` must still trigger a recalculation.
  for (const element of document.querySelectorAll("main, section[id]")) {
    observer.observe(element);
  }

  return () => observer.disconnect();
}

export function useScrollSpy(ids: readonly string[]) {
  const activeId = ref<string | null>(null);
  let stop = () => {};

  onMounted(() => {
    stop = observeSections(ids, (id) => {
      activeId.value = id;
    });
  });
  onBeforeUnmount(() => stop());

  return readonly(activeId);
}
