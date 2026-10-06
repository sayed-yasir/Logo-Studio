# Logo Studio sample gallery

`sample.json` is the single registry for visual examples used by the homepage and SEO category pages.

Each entry must reference a real Prompt ID from the existing Prompt Library. Do not invent IDs or create a second prompt database.

## Entry format

```json
{
  "category": "wordmark",
  "prompt": "WORDMARK-0001",
  "file": "images/WORDMARK-0001.webp",
  "alt": "Meaningful description of the actual image",
  "tool": "Optional image tool name",
  "aiGenerated": true
}
```

- `category` must match the real library category.
- `prompt` must be a real Prompt ID.
- `file` is relative to `samples/` and must be WebP.
- `alt` should accurately describe the image.
- `aiGenerated` must be `true` for every gallery sample. Gallery samples are AI-generated visual demonstrations, not client work.

The homepage displays a curated six samples; `/examples` displays the full registry.

Do not present samples as client work or finished identities.
