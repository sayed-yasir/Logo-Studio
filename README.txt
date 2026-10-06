Logo Studio
-----------
Open index.html in a modern browser (Chrome, Edge, Safari, Firefox). No server, install or internet connection needed.

index.html            page structure, logo mark, footer
css/style.css         all styles (follows the device's light/dark setting, with a manual toggle; responsive)
js/app.js             interface, routing, favorites, data-layer API
js/library.js         connects the prompt library (LogoStudio.connect); includes a fallback decompressor for older browsers
                      (js/library*.js are loaded in the background after the first screen; actions wait for them automatically)
js/library-data.js    the prompt library in compact compressed form (20 categories x 5000 prompts)
icons/                favicon, Apple touch icon and app icons
manifest.webmanifest  lets the site be installed to a phone's home screen (needs the site to be hosted)

To upload to a host, upload the whole folder keeping the same structure.
Share links only work once the site is hosted online (not from a local file).
Optional: add an og:image meta tag with the full URL of a preview image to get a picture when the link is shared.

SEO / indexability
------------------
index.html            home page; its SEO block and intro section are generated (see tools/)
og-image-1200x630.jpg social preview image (1.91:1). og-image.jpg is kept so old shared links still show a picture.
css/seo.css           styles for the intro section, category pages, example prompt and gallery
js/seo-page.js        theme toggle for the static category pages
*-logo-prompts/       20 static, indexable category pages (index.html each). Each one shows 6 real design
                      directions and one real example prompt (with its Prompt ID, linked to the full prompt) taken from js/library-data.js
samples/              gallery of AI-generated examples. Empty on purpose: see samples/README.md
sitemap.xml, robots.txt
tools/                optional, dependency-free Node scripts (not needed to run the site):
                        seo-config.mjs      SITE_URL, home title/description, social image and GOOGLE_SITE_VERIFICATION
                        seo-categories.mjs  copy for the 20 category pages
                        generate-seo.mjs    run `node tools/generate-seo.mjs` to regenerate pages, sitemap.xml, robots.txt
                                            and the marked SEO blocks in index.html
                        lastmod.json        written by the generator: remembers each page's content so only pages that
                                            really changed get a new <lastmod> date. Keep it in the repository.

Common tasks
- Custom domain: change SITE_URL in tools/seo-config.mjs and run the generator.
- Google verification: GOOGLE_SITE_VERIFICATION in tools/seo-config.mjs is written to the home page only.
  Leave it as "" and no verification tag is generated. Keep the value while the site is verified in Search Console.
- Change a title/description/text: edit tools/seo-categories.mjs, then run the generator. Titles over 60 characters and
  descriptions over 160 characters are reported as warnings.
- Add AI-generated example images: follow samples/README.md. A category shows a gallery only when real images are listed.

Note: robots.txt is only read by crawlers at the root of a domain. On a GitHub Pages project site it is not at the root,
so submit sitemap.xml in Google Search Console / Bing Webmaster Tools instead.
