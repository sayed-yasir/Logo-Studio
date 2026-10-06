# Logo Studio sample gallery

`samples.json` is the single registry for the visual examples used by the homepage,
`#/examples`, and the relevant static SEO category pages.

Each entry must reference a real Prompt ID from the existing Prompt Library.
Do not invent IDs or create a second prompt database.

## Entry format

```json
{
  "category": "wordmark",
  "image": "samples/images/WORDMARK-0001.webp",
  "file": "images/WORDMARK-0001.webp",
  "title": "Example title",
  "alt": "Accurate description of the visual example",
  "tool": "OpenAI image generation",
  "aiGenerated": true,
  "prompt": "WORDMARK-0001",
  "promptId": "WORDMARK-0001"
}
```

- `category` must match a real library category.
- `promptId` (or the legacy `prompt` field) must be a real Prompt ID.
- `image` is relative to the project root and must point to an existing image.
- `file` is relative to `samples/` and is kept for registry compatibility.
- `alt` must accurately describe the actual image.
- `aiGenerated` must be `true` for gallery samples.
- `tool` identifies the image-generation tool when known.

The homepage displays up to six samples; `#/examples` displays the complete registry.
The three current categories with gallery examples are Wordmark, Monogram and Minimal.

Gallery images are AI-generated concept demonstrations, not client work or finished brand
identities. Their Prompt IDs must always resolve through the existing prompt library.
