---
title: "Less JavaScript, more web"
description: "A small reminder that the fastest feature is sometimes the one you do not need to ship."
pubDate: 2026-10-12
tags: ["performance", "web"]
example: true
---
This is an illustrative post. Replace it with your own writing, or keep it around as a formatting reference.

## Start with the document

A personal website has a simple job: let someone learn about you, read your work, and find a way to say hello. None of those things needs a JavaScript application.

HTML already knows how to navigate. CSS already knows how to lay out a page. A good starting point is to let them.

> Ship the experience. Leave the machinery behind.

## A smaller starting point

With Astro, a page can be just a document:

```astro
---
const greeting = 'Hello, reader.';
---
<main>
  <h1>{greeting}</h1>
  <p>No hydration required.</p>
</main>
```

The frontmatter runs at build time. The visitor receives the rendered HTML, not the component runtime.

## Spend your budget intentionally

- Use real links for navigation.
- Reach for system fonts before loading another font file.
- Give images explicit dimensions to avoid layout shifts.
- Add an interactive island only when the interaction genuinely earns its place.

That does not mean JavaScript is bad. It means every dependency should have a reason to be there.

Read the [notes on a quieter interface](/blog/a-quieter-interface/) for the other half of the idea: less visual noise.
