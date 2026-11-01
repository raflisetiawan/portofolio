// Writes the rendered page and structured data into dist/index.html, so crawlers
// and visitors get the full content before any JavaScript runs.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ROOT_MARKER = '<div id="app"></div>';
const HEAD_MARKER = "</head>";
const REQUIRED_TEXT = ["Experience", "BeSpoke Decision Support Tool", "Bachelor of Informatics"];

const serverBuild = resolve("dist-ssr/entry-server.js");
const { renderPage, personSchemaScript } = await import(pathToFileURL(serverBuild).href);

const template = readFileSync("dist/index.html", "utf8");
for (const marker of [ROOT_MARKER, HEAD_MARKER]) {
  if (!template.includes(marker)) throw new Error(`dist/index.html has no ${marker}`);
}

const page = await renderPage();
for (const text of REQUIRED_TEXT) {
  if (!page.includes(text)) throw new Error(`Rendered page is missing "${text}"`);
}

// Function replacers, so "$" in the content isn't read as a replacement pattern.
const html = template
  .replace(ROOT_MARKER, () => `<div id="app">${page}</div>`)
  .replace(HEAD_MARKER, () => `  ${personSchemaScript()}\n  ${HEAD_MARKER}`);

writeFileSync("dist/index.html", html);
rmSync("dist-ssr", { recursive: true, force: true });
console.log(`Prerendered dist/index.html (${html.length} characters)`);
