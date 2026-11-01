import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";

export { personSchemaScript } from "./seo/personSchema";

/** Renders the page to HTML at build time. See scripts/prerender.mjs. */
export function renderPage(): Promise<string> {
  return renderToString(createSSRApp(App));
}
