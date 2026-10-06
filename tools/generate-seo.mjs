// Optional maintenance script (no dependencies, not needed to run the site).
//   node tools/generate-seo.mjs
// Regenerates: 20 category pages, sitemap.xml, robots.txt, and the marked SEO
// blocks inside index.html. Every absolute URL is derived from SITE_URL.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_URL, SITE_NAME, HOME_TITLE, HOME_DESCRIPTION,
  OG_IMAGE_PATH, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_IMAGE_ALT, GOOGLE_SITE_VERIFICATION
} from "./seo-config.mjs";
import { CATEGORIES } from "./seo-categories.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LASTMOD = process.env.LASTMOD || new Date().toISOString().slice(0, 10);
if (!SITE_URL.endsWith("/")) throw new Error("SITE_URL must end with a slash");

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = o => `<script type="application/ld+json">${JSON.stringify(o, null, 2).replace(/</g, "\\u003c")}</script>`;
const url = (path = "") => SITE_URL + path;
const catPath = c => `${c.slug}-logo-prompts/`;
const catUrl = c => url(catPath(c));
const byId = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const IMG = url(OG_IMAGE_PATH);

/* ---------- Google Search Console verification (home page only; nothing is written when the value is empty) ---------- */
const VERIFY = String(GOOGLE_SITE_VERIFICATION ?? "").trim();
if (VERIFY && !/^[A-Za-z0-9_-]{20,120}$/.test(VERIFY)) {
  throw new Error("GOOGLE_SITE_VERIFICATION in seo-config.mjs looks invalid. Paste only the content=\"...\" value (letters, digits, - and _).");
}
const verifyTag = VERIFY ? `<meta name="google-site-verification" content="${esc(VERIFY)}">\n` : "";

/* ---------- real data from the prompt library (js/library-data.js) ---------- */
function loadLibrary() {
  const src = readFileSync(join(ROOT, "js/library-data.js"), "utf8");
  const b64 = /LIB_B64="([^"]+)"/.exec(src)?.[1];
  if (!b64) throw new Error("Could not find LIB_B64 in js/library-data.js");
  const buf = gunzipSync(Buffer.from(b64, "base64"));
  const len = buf.readUInt32BE(0);
  return { M: JSON.parse(buf.subarray(4, 4 + len).toString("utf8")), BIN: buf.subarray(4 + len) };
}
const LIB = loadLibrary();
const LIBCAT = Object.fromEntries(LIB.M.c.map(c => [c.id, c]));
const pad4 = n => String(n).padStart(4, "0");
// Same row decoding as js/library.js: one option per field, picked by the byte stored for that prompt.
function promptParts(lc, n) {
  const w = lc.v.length, row = lc.o + (n - 1) * w;
  return lc.f.map((opts, k) => { const v = lc.v.indexOf(k); return opts[v < 0 ? 0 : LIB.BIN[row + v]]; });
}
const section = (parts, name) => parts[LIB.M.h.indexOf(name) + 1];

/* Six real "design idea" options + one real prompt excerpt per category. Deterministic: same library -> same page. */
function sampleFor(c) {
  const lc = LIBCAT[c.id];
  if (!lc) throw new Error(`Category "${c.id}" does not exist in the prompt library`);
  const n = 101 + CATEGORIES.indexOf(c) * 137;
  const parts = promptParts(lc, n);
  const idea = section(parts, "DESIGN IDEA");
  const ideas = lc.f[1], picks = [];
  for (let i = 0; i < ideas.length && picks.length < 6; i += 3) picks.push(ideas[ideas[i] === idea ? i + 1 : i]);
  return {
    id: `${lc.p}-${pad4(n)}`,
    directions: picks,
    excerpt: [["Design idea", idea], ["Brand personality", section(parts, "BRAND PERSONALITY")], ["Geometry", section(parts, "GEOMETRY").split(" Stroke and corner treatment: ")[0]]]
  };
}
function sampleHtml(c) {
  const s = sampleFor(c);
  return `<section class="seo-sec" aria-labelledby="a-dir"><h2 id="a-dir">Design directions in the ${esc(c.name)} library</h2>
<p>Six of the design ideas that ${esc(c.name)} prompts can start from. Each ${esc(c.name)} prompt in the library pairs one idea like these with its own composition, typography and color logic.</p>
<ul>
${s.directions.map(d => `<li>${esc(d)}</li>`).join("\n")}
</ul>
</section>
<section class="seo-sec" aria-labelledby="a-ex"><h2 id="a-ex">Example ${esc(c.name)} prompt</h2>
<p>An excerpt of a real prompt from the library. <a href="../#/prompt/${encodeURIComponent(s.id)}">Open the full ${esc(c.name)} prompt</a> to read every section and customize it with your brand name.</p>
<aside class="seo-sample" aria-label="Example prompt excerpt"><p class="seo-sample-id">Prompt ID <code>${esc(s.id)}</code></p>
<dl>
${s.excerpt.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("\n")}
</dl></aside>
</section>`;
}

/* ---------- gallery of AI-generated examples (samples/samples.json) ---------- */
// Nothing is rendered for a category until real images are listed for it. Entries are validated strictly,
// so a typo, a missing file or an unlabelled image stops the build instead of publishing something wrong.
function webpSize(b) {
  if (b.length < 30 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const t = b.toString("ascii", 12, 16);
  if (t === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (t === "VP8L") { const x = b.readUInt32LE(21); return { w: (x & 0x3fff) + 1, h: ((x >> 14) & 0x3fff) + 1 }; }
  if (t === "VP8X") return { w: 1 + (b[24] | b[25] << 8 | b[26] << 16), h: 1 + (b[27] | b[28] << 8 | b[29] << 16) };
  return null;
}
const sha = s => createHash("sha256").update(s).digest("hex").slice(0, 16);
const GALLERY = {};
function loadGallery() {
  const file = join(ROOT, "samples/samples.json");
  if (!existsSync(file)) return;
  const data = JSON.parse(readFileSync(file, "utf8"));
  const list = Array.isArray(data) ? data : data.images;
  if (!Array.isArray(list)) throw new Error('samples/samples.json must contain an "images" array');
  list.forEach((e, i) => {
    const where = `samples/samples.json, image #${i + 1}`;
    const c = byId[e.category];
    if (!c) throw new Error(`${where}: unknown category "${e.category}"`);
    const lc = LIBCAT[c.id];
    const m = /^([A-Z][A-Z-]*)-(\d{4})$/.exec(String(e.prompt || ""));
    if (!m || m[1] !== lc.p || +m[2] < 1 || +m[2] > 5000) throw new Error(`${where}: "prompt" must be a real ID of this category, from ${lc.p}-0001 to ${lc.p}-5000`);
    if (e.aiGenerated !== true) throw new Error(`${where}: "aiGenerated" must be true for gallery samples.`);
    if (typeof e.file !== "string" || e.file.includes("..") || !/^[a-z0-9][a-z0-9._/-]*\.webp$/i.test(e.file)) throw new Error(`${where}: "file" must be a .webp path relative to the samples folder`);
    const path = join(ROOT, "samples", e.file);
    if (!existsSync(path)) throw new Error(`${where}: samples/${e.file} does not exist`);
    const alt = String(e.alt || "").trim();
    if (alt.length < 10 || alt.length > 200) throw new Error(`${where}: "alt" must describe the image in 10-200 characters`);
    const bytes = readFileSync(path), dim = webpSize(bytes);
    if (!dim) throw new Error(`${where}: samples/${e.file} is not a valid WebP image`);
    if (statSync(path).size > 300000) console.warn(`Warning: samples/${e.file} is larger than 300 KB; compress it for faster pages.`);
    const tool = String(e.tool || "").trim().slice(0, 60);
    (GALLERY[c.id] ||= []).push({ file: e.file, prompt: e.prompt, alt, tool, aiGenerated: e.aiGenerated === true, w: dim.w, h: dim.h, hash: sha(bytes) });
  });
}
function galleryHtml(c) {
  const items = GALLERY[c.id];
  if (!items || !items.length) return "";
  const figs = items.map(g => `<figure>
<img src="../samples/${esc(g.file)}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async">
<figcaption><span class="ai-badge">AI-generated</span>Prompt <a href="../#/prompt/${encodeURIComponent(g.prompt)}">${esc(g.prompt)}</a>${g.tool ? ` · ${esc(g.tool)}` : ""}</figcaption>
</figure>`).join("\n");
  return `<section class="seo-sec seo-gallery" aria-labelledby="a-gal"><h2 id="a-gal">AI-generated ${esc(c.name)} examples</h2>
<p>These are AI-generated visual demonstrations connected to real prompts in the ${esc(c.name)} library. They are concept examples, not client work or finished brand identities.</p>
<div class="seo-gal-grid">
${figs}
</div>
</section>`;
}

/* ---------- lastmod: a page only gets a new date when its content really changed (tools/lastmod.json) ---------- */
const LM_FILE = join(ROOT, "tools/lastmod.json");
const lmPrev = existsSync(LM_FILE) ? JSON.parse(readFileSync(LM_FILE, "utf8")) : {};
const lmNext = {};
function stamp(key, content) {
  const hash = sha(content), prev = lmPrev[key];
  lmNext[key] = prev && prev.hash === hash ? prev : { hash, lastmod: LASTMOD };
  return lmNext[key].lastmod;
}

/* ---------- shared head pieces ---------- */
function social({ title, description, pageUrl }) {
  return `<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(IMG)}">
<meta property="og:image:width" content="${OG_IMAGE_WIDTH}">
<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}">
<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(IMG)}">
<meta name="twitter:image:alt" content="${esc(OG_IMAGE_ALT)}">`;
}

/* ---------- homepage blocks ---------- */
function homeHead() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite", "@id": url("#website"), url: SITE_URL, name: SITE_NAME,
        description: HOME_DESCRIPTION, inLanguage: "en"
      },
      {
        "@type": "WebApplication", "@id": url("#webapp"), url: SITE_URL, name: SITE_NAME,
        description: HOME_DESCRIPTION, applicationCategory: "DesignApplication",
        operatingSystem: "Any", browserRequirements: "Requires JavaScript",
        image: IMG, inLanguage: "en", isPartOf: { "@id": url("#website") }
      }
    ]
  };
  return `<!--SEO:START generated by tools/generate-seo.mjs; edit tools/seo-config.mjs instead of this block-->
<title>${esc(HOME_TITLE)}</title>
<meta name="description" content="${esc(HOME_DESCRIPTION)}">
<link rel="canonical" href="${esc(SITE_URL)}">
${verifyTag}${social({ title: HOME_TITLE, description: HOME_DESCRIPTION, pageUrl: SITE_URL })}
${ld(graph)}
<!--SEO:END-->`;
}

function homeIntro() {
  const links = CATEGORIES.map(c => `<li><a href="${catPath(c)}">${esc(c.name)} logo prompts</a></li>`).join("\n");
  return `<!--SEO-INTRO:START generated by tools/generate-seo.mjs-->
<div class="wrap seo-intro" id="seo-intro">
<div class="seo-intro-grid">
<div>
<section aria-labelledby="si-what"><h2 id="si-what">What is Logo Studio?</h2>
<p>Logo Studio is a web app for discovering and developing logo design directions. It gives designers and creators a professional logo design prompt library: structured, written prompts that can be pasted into any image tool or shared with a designer as a starting brief.</p></section>
<section aria-labelledby="si-do"><h2 id="si-do">What you can do with it</h2>
<ul>
<li>Generate a prompt from a brand name and a logo style.</li>
<li>Search the library by keyword, category or Prompt ID.</li>
<li>Customize any prompt with your own brand name before copying it.</li>
<li>Save favorites on your device and share a link to a prompt.</li>
</ul></section>
</div>
<div>
<section aria-labelledby="si-styles"><h2 id="si-styles">Logo styles you can explore</h2>
<p>Each style below has its own short guide covering what the approach is, which brands it can suit and what to check in practice.</p>
<ul class="seo-links">
${links}
</ul></section>
<section aria-labelledby="si-brand"><h2 id="si-brand">Customize prompts with your brand name</h2>
<p>Enter a brand name once and every prompt shows it in place, so you can copy a ready-to-use brief. Without a name, prompts show a clear placeholder that you can replace later.</p></section>
</div>
</div>
</div>
<!--SEO-INTRO:END-->`;
}

function patchIndex() {
  const file = join(ROOT, "index.html");
  let html = readFileSync(file, "utf8");
  const swap = (name, block) => {
    const re = new RegExp(`<!--${name}:START[\\s\\S]*?<!--${name}:END-->`);
    if (!re.test(html)) throw new Error(`index.html is missing the ${name} markers`);
    html = html.replace(re, () => block);
  };
  swap("SEO", homeHead());
  swap("SEO-INTRO", homeIntro());
  writeFileSync(file, html);
}

/* ---------- category pages ---------- */
const SPRITE = `<svg hidden xmlns="http://www.w3.org/2000/svg">
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></symbol>
<symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></symbol>
<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></symbol>
<symbol id="i-wand" viewBox="0 0 24 24"><path d="M5 19L16 8M14 6l4 4M7 4v3M5.5 5.5h3M19 15v3M17.5 16.5h3"/></symbol>
<symbol id="ls" viewBox="0 0 100 100"><path fill="var(--text)" fill-rule="evenodd" d="M81.95 36.71 L66.56 51.91 L51.48 52.09 L29.20 74.38 L33.86 79.22 L48.21 93.33 L48.94 93.70 L50.15 93.82 L51.06 93.70 L52.21 93.03 L93.52 51.91 L94.00 50.58 L94.00 49.49 L93.39 48.09ZM85.64 50.03 L50.09 85.40 L35.01 70.56 L52.09 53.36 L67.11 53.24 L77.89 42.46ZM51.18 6.36 L50.39 6.18 L49.00 6.30 L47.55 7.21 L6.73 47.91 L6.18 48.82 L6.06 50.70 L6.24 51.36 L6.91 52.39 L24.77 70.08 L25.80 70.62 L27.80 70.68 L29.01 70.08 L50.45 48.70 L64.26 48.70 L65.29 48.40 L66.44 47.61 L77.34 36.71 L78.01 35.62 L78.13 33.62 L77.47 32.22 L76.68 31.50 L75.71 31.07 L74.07 31.07 L72.62 31.80 L62.39 41.85 L49.49 41.79 L48.27 41.91 L47.55 42.22 L46.15 43.37 L26.89 62.51 L14.42 50.15 L49.91 14.60 L50.21 14.66 L67.65 32.04 L67.96 31.98 L72.50 27.38 L52.27 7.03Z"/></symbol></svg>`;

const THEME_BOOT = `<script>try{var t=JSON.parse(localStorage.getItem("ls:theme"));if(t!=="light"&&t!=="dark")t=null;if(!t&&matchMedia("(prefers-color-scheme: light)").matches)t="light";if(t){document.documentElement.dataset.theme=t;if(t==="light")document.querySelector("meta[name=theme-color]").content="#F7F5FC"}}catch(e){}</script>`;
const FAVICON_SVG = `<link rel="icon" type="image/svg+xml" href="../icons/favicon.svg">`;

const ic = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const NAV = [["Home", "../", "home"], ["Search", "../#/search", "search"], ["Categories", "../#/categories", "grid"], ["Favorites", "../#/favorites", "heart"]];
const navHtml = NAV.map(l => `<a href="${l[1]}">${ic(l[2])}${l[0]}</a>`).join("");

function categoryPage(c) {
  const pageUrl = catUrl(c);
  const gen = `../#/?c=${encodeURIComponent(c.id)}`;
  const search = `../#/search?c=${encodeURIComponent(c.id)}`;
  const crumb = `${c.name} logo prompts`;
  const bc = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: crumb, item: pageUrl }
    ]
  };
  const related = c.related.map(id => {
    const r = byId[id];
    if (!r) throw new Error(`Unknown related id ${id} on ${c.id}`);
    return `<li><a href="../${catPath(r)}">${esc(r.name)} logo prompts</a></li>`;
  }).join("\n");
  const style = c.style.map(p => `<p>${esc(p)}</p>`).join("\n");
  const cons = c.considerations.map(x => `<li>${esc(x)}</li>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#07060B">
<meta name="color-scheme" content="dark light">
${THEME_BOOT}
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${esc(pageUrl)}">
${social({ title: c.title, description: c.description, pageUrl })}
${FAVICON_SVG}
<link rel="icon" type="image/png" sizes="32x32" href="../icons/icon-32.png">
<link rel="apple-touch-icon" href="../icons/apple-touch-icon.png">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/seo.css">
${ld(bc)}
</head>
<body>
${SPRITE}
<header class="top"><div class="wrap">
<a class="logo" href="../" aria-label="Logo Studio home"><svg class="mk" viewBox="0 0 32 32" aria-hidden="true"><use href="#ls"/></svg><span>Logo Studio</span></a>
<nav class="nav" aria-label="Main">${navHtml}</nav>
<button class="tg" data-act="theme" aria-label="Toggle light and dark mode"><svg class="ic sun"><use href="#i-sun"/></svg><svg class="ic moon"><use href="#i-moon"/></svg></button>
</div></header>
<main><div class="wrap"><article class="seo-page view">
<nav class="seo-crumbs" aria-label="Breadcrumb"><a href="../">Logo Studio</a><span aria-hidden="true">/</span><span aria-current="page">${esc(crumb)}</span></nav>
<h1 class="h2">${esc(c.h1)}</h1>
<p class="lede">${esc(c.intro)}</p>
<div class="seo-actions"><a class="btn pri" href="${gen}">${ic("wand")}Generate a ${esc(c.name)} prompt</a><a class="btn sec" href="${search}">${ic("search")}Browse ${esc(c.name)} prompts</a></div>
<section class="seo-sec" aria-labelledby="a1"><h2 id="a1">About the ${esc(c.name)} style</h2>
${style}
</section>
<section class="seo-sec" aria-labelledby="a2"><h2 id="a2">Brands it can suit</h2>
<p>${esc(c.suits)}</p>
</section>
${sampleHtml(c)}
${galleryHtml(c)}
<section class="seo-sec" aria-labelledby="a3"><h2 id="a3">Practical design considerations</h2>
<ul>
${cons}
</ul>
</section>
<section class="seo-sec" aria-labelledby="a4"><h2 id="a4">Use it in Logo Studio</h2>
<p>Enter your brand name and <a href="${gen}">generate a structured ${esc(c.name)} prompt</a>, or <a href="${search}">browse the ${esc(c.name)} prompts</a> to compare directions, open a prompt's details and save favorites on your device.</p>
</section>
<section class="seo-sec" aria-labelledby="a5"><h2 id="a5">Related logo styles</h2>
<ul class="seo-links">
${related}
</ul>
<p style="margin-top:14px"><a href="../">See all logo styles on the Logo Studio home page</a></p>
</section>
</article></div></main>
<footer class="foot"><div class="wrap">
<div class="fgrid"><div><a class="logo" href="../" aria-label="Logo Studio home"><svg class="mk" viewBox="0 0 32 32" aria-hidden="true"><use href="#ls"/></svg><span>Logo Studio</span></a>
<p>A professional tool for discovering and developing logo design directions through structured creative prompts.</p></div>
<nav aria-label="Footer"><a href="../">Home</a><a href="../#/search">Search</a><a href="../#/categories">Categories</a><a href="../#/favorites">Favorites</a></nav></div>
<p class="legal">© 2026 Logo Studio · Built by Yasir</p>
</div></footer>
<nav class="bnav" aria-label="Mobile">${navHtml}</nav>
<script src="../js/seo-page.js"></script>
</body>
</html>
`;
}

function writeCategoryPages() {
  return CATEGORIES.map(c => {
    const dir = join(ROOT, catPath(c));
    const html = categoryPage(c);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    return { c, html };
  });
}

/* ---------- sitemap + robots ---------- */
function writeSitemapAndRobots(pages) {
  const home = readFileSync(join(ROOT, "index.html"), "utf8");
  const entries = [
    { loc: SITE_URL, lastmod: stamp(SITE_URL, home), images: [] },
    ...pages.map(({ c, html }) => {
      const imgs = GALLERY[c.id] || [];
      return { loc: catUrl(c), lastmod: stamp(catUrl(c), html + imgs.map(g => g.hash).join()), images: imgs.map(g => url("samples/" + g.file)) };
    })
  ];
  const withImages = entries.some(e => e.images.length);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${withImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ""}>
${entries.map(e => `  <url>\n    <loc>${esc(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>${e.images.map(i => `\n    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join("")}\n  </url>`).join("\n")}
</urlset>
`;
  writeFileSync(join(ROOT, "sitemap.xml"), xml);
  writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url("sitemap.xml")}\n`);
  const sorted = Object.fromEntries(Object.keys(lmNext).sort().map(k => [k, lmNext[k]]));
  writeFileSync(LM_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

if (new Set(CATEGORIES.map(c => c.slug)).size !== CATEGORIES.length) throw new Error("duplicate slug");
if (HOME_TITLE.length > 60) console.warn(`Warning: home title is ${HOME_TITLE.length} characters (search results usually cut after ~60).`);
if (HOME_DESCRIPTION.length > 160) console.warn(`Warning: home description is ${HOME_DESCRIPTION.length} characters (search results usually cut after ~160).`);
for (const c of CATEGORIES) {
  if (c.title.length > 60) console.warn(`Warning: title of ${c.id} is ${c.title.length} characters.`);
  if (c.description.length > 160) console.warn(`Warning: description of ${c.id} is ${c.description.length} characters.`);
}
loadGallery();
const pages = writeCategoryPages();
patchIndex();
writeSitemapAndRobots(pages);
const nImg = Object.values(GALLERY).reduce((n, l) => n + l.length, 0);
console.log(`Generated ${CATEGORIES.length} category pages (${nImg} gallery image${nImg === 1 ? "" : "s"}), sitemap.xml, robots.txt and index.html SEO blocks for ${SITE_URL}${VERIFY ? " (with Google verification tag)" : " (no verification tag)"}`);
