import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { observeSections, resolveActiveSection } from "./useScrollSpy";

const ids = ["about", "experience", "projects"];

function positions(about: number, experience: number, projects: number) {
  return [
    { id: "about", top: about },
    { id: "experience", top: experience },
    { id: "projects", top: projects },
  ];
}

describe("resolveActiveSection", () => {
  it("returns the last section that started above the line", () => {
    expect(resolveActiveSection(positions(-400, 100, 900), 300)).toBe("experience");
  });

  it("returns the last section after the page jumps past all of them", () => {
    expect(resolveActiveSection(positions(-3000, -2000, -900), 300)).toBe("projects");
  });

  it("returns null before the first section is reached", () => {
    expect(resolveActiveSection(positions(500, 900, 1400), 300)).toBeNull();
  });

  it("treats a section exactly on the line as started", () => {
    expect(resolveActiveSection(positions(300, 900, 1400), 300)).toBe("about");
  });
});

describe("observeSections", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does nothing when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const onChange = vi.fn();
    expect(() => observeSections(ids, onChange)()).not.toThrow();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports the active section on crossings, skips missing elements, and disconnects", () => {
    let notify = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    const tops: Record<string, number> = { about: -500, experience: 100 };

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        disconnect = disconnect;
        constructor(callback: () => void) {
          notify = callback;
        }
      },
    );
    vi.stubGlobal("window", { innerHeight: 1000 });
    vi.stubGlobal("document", {
      getElementById: (id: string) =>
        id in tops ? { id, getBoundingClientRect: () => ({ top: tops[id] }) } : null,
      querySelectorAll: () => ["main", "about", "experience", "contact"],
    });

    const onChange = vi.fn();
    const stop = observeSections(ids, onChange);

    // Elements outside `ids`, such as a contact section, still trigger updates.
    expect(observe).toHaveBeenCalledWith("contact");
    expect(observe).toHaveBeenCalledTimes(4);

    notify();
    expect(onChange).toHaveBeenLastCalledWith("experience");

    stop();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
