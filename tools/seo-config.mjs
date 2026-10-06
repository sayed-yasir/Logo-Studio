// Single source of truth for every absolute SEO URL (canonical, Open Graph,
// Twitter Card, JSON-LD, sitemap.xml, robots.txt).
// To move to a custom domain later: change this one value and run
//   node tools/generate-seo.mjs
export const SITE_URL = "https://sayed-yasir.github.io/Logo-Studio/";

export const SITE_NAME = "Logo Studio";
export const HOME_TITLE = "Logo Studio — Professional AI Logo Design Prompts";
export const HOME_DESCRIPTION =
  "Discover, customize and save professional logo design prompts. Enter a brand name, choose a style and generate a structured prompt.";
export const OG_IMAGE_PATH = "og-image-1200x630.jpg";   // real file at the project root (1.91:1, the size Facebook/LinkedIn/X expect)
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
  "Logo Studio logo: a black geometric diamond mark above the words LOGO STUDIO";

// Google Search Console "HTML tag" verification: paste ONLY the content="..." value of the
// <meta name="google-site-verification"> tag. It is written to the home page only.
// Leave it as "" and no verification tag is generated at all.
export const GOOGLE_SITE_VERIFICATION = "DiyC2jSpFcfyHADv39WhzP3Uac65fN646XlSXNOwAkI";
