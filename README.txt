Logo Studio
-----------
Open index.html in a modern browser (Chrome, Edge, Safari, Firefox). No server, install or internet connection needed.

index.html            page structure, logo mark, footer
css/style.css         all styles (follows the device's light/dark setting, with a manual toggle; responsive)
js/app.js             interface, routing, favorites, data-layer API
js/library.js         connects the prompt library (LogoStudio.connect); includes a fallback decompressor for older browsers
js/library-data.js    the prompt library in compact compressed form (20 categories x 5000 prompts)
icons/                favicon, Apple touch icon and app icons
manifest.webmanifest  lets the site be installed to a phone's home screen (needs the site to be hosted)

To upload to a host, upload the whole folder keeping the same structure.
Share links only work once the site is hosted online (not from a local file).
Optional: add an og:image meta tag with the full URL of a preview image to get a picture when the link is shared.

SEO / indexability (added)
--------------------------
og-image.jpg          social preview image (the Logo Studio logo, unmodified)
css/seo.css           styles for the intro section and category pages (uses existing design tokens)
js/seo-page.js        theme toggle for the static category pages
*-logo-prompts/       20 static, indexable category pages (index.html each)
sitemap.xml, robots.txt
tools/                optional, dependency-free Node scripts (not needed to run the site):
                        seo-config.mjs      SITE_URL and homepage title/description (single source of truth)
                        seo-categories.mjs  copy for the 20 category pages
                        generate-seo.mjs    run `node tools/generate-seo.mjs` to regenerate pages, sitemap,
                                            robots.txt and the marked SEO blocks in index.html
To move to a custom domain: change SITE_URL in tools/seo-config.mjs and re-run the generator.
Note: robots.txt is only read by crawlers at the root of a domain. On a GitHub Pages project site it
is not at the root, so submit sitemap.xml in Google Search Console / Bing Webmaster Tools instead.
