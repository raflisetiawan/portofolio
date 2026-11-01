import { createApp, createSSRApp } from "vue";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./assets/main.css";
import App from "./App.vue";

// The production page is prerendered and only needs hydrating. `vp dev` starts empty.
const isPrerendered = document.querySelector("#app")?.hasChildNodes();
(isPrerendered ? createSSRApp(App) : createApp(App)).mount("#app");
