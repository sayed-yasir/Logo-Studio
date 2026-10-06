Logo Studio
===========

A static, client-side logo prompt generator and visual example gallery.

Project structure
-----------------
index.html            Main application shell and SEO content.
css/style.css         Main responsive UI styles.
css/seo.css           Styles for SEO/category content and gallery sections.
js/app.js             UI, hash routing, generator, search, favorites and gallery.
js/library.js         Prompt-library adapter.
js/library-data.js    Compressed prompt-library data.
js/seo-page.js        Theme support for static SEO category pages.
samples/samples.json  Single registry for the visual example gallery.
samples/images/       WebP gallery images referenced by samples.json.
*-logo-prompts/       20 static, crawlable category pages.
icons/                Favicons and install icons.
manifest.webmanifest  Web-app manifest.
tools/                SEO generation/configuration scripts and lastmod data.

Gallery
-------
The homepage shows up to 6 curated samples. The full gallery is available at:
#/examples

Gallery samples are visual demonstrations, not client work. Every sample must use
a real Prompt ID from the existing prompt library. Do not create a second prompt database.
View Prompt opens the existing prompt-details flow. Use Prompt loads that same real prompt
into the existing generator.

Local testing
-------------
Because the gallery loads samples/samples.json with fetch(), test the application through
a local HTTP server rather than opening index.html directly with file://.
For example:

  python -m http.server 8000

Then open http://localhost:8000/ in a browser.

Deployment
----------
Upload the entire project folder while preserving its structure. The GitHub Pages project
URL is configured as:

  https://sayed-yasir.github.io/Logo-Studio/

The hash routes (#/, #/examples, #/search, #/categories, #/favorites and #/prompt/...) are
handled by js/app.js, so GitHub Pages does not need separate files for those application views.

SEO
---
The 20 category pages are static and crawlable. sitemap.xml contains the canonical HTTPS
URLs. robots.txt points crawlers to the project sitemap. The hash-based application routes
are UI routes and are not listed as separate sitemap URLs.

To regenerate SEO files after changing SEO source content, run:

  node tools/generate-seo.mjs

Google Search Console verification is configured in tools/seo-config.mjs. Keep the verification
value only while it is valid for the site.
