import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const file = path => join(root.pathname, path);
const html = readFileSync(file("index.html"), "utf8");
const css = readFileSync(file("assets/styles.css"), "utf8");
const js = readFileSync(file("assets/app.js"), "utf8");

for (const path of ["assets/styles.css", "assets/app.js", "assets/logo.svg", "assets/favicon.svg", "robots.txt", "sitemap.xml"]) {
  assert(existsSync(file(path)), "Missing " + path);
}

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]));
for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.has(target), "Broken anchor #" + target);
}
for (const [, asset] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
  assert(existsSync(file(asset)), "Broken asset path " + asset);
}
for (const color of ["#38a6ea", "#0072b2", "#a92974", "#eee8a9"]) {
  assert(css.toLowerCase().includes(color), "Missing brand color " + color);
}
for (const program of ["Paket A", "Paket B", "Paket C", "Homeschooling"]) {
  assert(html.includes(program), "Missing program " + program);
}
for (const id of ["menu-toggle", "main-nav", "inquiry-form", "program-choice", "current-year"]) {
  assert(ids.has(id), "Missing required UI element " + id);
}
assert(html.includes("P9957052"), "NPSN missing");
assert(html.includes("tunasedukasi@gmail.com"), "Contact email missing");
assert(html.includes('rel="canonical"'), "Canonical missing");
assert(html.includes('type="application/ld+json"'), "Structured data missing");
assert(html.includes('lang="id"'), "Language missing");

const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(schema, "Missing schema block");
JSON.parse(schema[1]);
execFileSync(process.execPath, ["--check", file("assets/app.js")]);

const images = [...html.matchAll(/<img\b([^>]+)>/g)];
for (const img of images) assert(/\balt="/.test(img[1]), "Image without alt attribute");

console.log("PASS: Assets, internal links, colors, programs, SEO, accessibility essentials, and JS syntax");
