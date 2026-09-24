# cocode.dk brand

The family frame shared by every cocode.dk project site: a `<cocode-head>` and a `<cocode-foot>`
web component, served from **https://brand.cocode.dk**. Each site keeps its own design; the frame
is only the furniture around it.

## Use it

```html
<link rel="stylesheet" href="https://brand.cocode.dk/v1.css">
<script type="module" src="https://brand.cocode.dk/v1.js"></script>

<cocode-head project="Weather" accent="#2b6cb0">
  <a href="https://cocode.dk">cocode.dk</a>   <!-- shown when JavaScript is off -->
</cocode-head>
…the site's own page…
<cocode-foot project="Weather" repo="cocodedk/weather-android">
  <a href="https://cocode.dk">Lavet af Babak</a>
</cocode-foot>
```

The page-level `<link>` is required: it carries the fonts and the `--cd-*` tokens, which a shadow
root only receives from the document.

| attribute | meaning |
|---|---|
| `project` | name shown beside the wordmark |
| `accent`, `on-accent` | the site's own colour |
| `dark` | the site is dark; the frame reads light on it. `dark="auto"` follows the visitor's colour scheme |
| `lang` | `da`, `en` or `fa` (right to left); defaults to `<html lang>` |
| `links` | extra head links, `"Download:#dl,Kilde:https://…"` |
| `repo` | foot links to `github.com/<repo>` |
| `fdroid` | foot links to the F-Droid page for that app id, once it is published |

To line the frame up with the site's column, set two properties from the site's own CSS, media
queries included:

```css
cocode-head, cocode-foot { --cocode-max: 1080px; --cocode-gutter: 20px; }   /* defaults 1240px, 20px */
```

The language switch is not an attribute: the head reads the page's
`<link rel="alternate" hreflang>` tags and builds the switcher from them.

## How it works

Styles are written with [StyleX](https://stylexjs.com) and compiled at build time to atomic CSS
in `v1.css`; the elements render into shadow DOM, so a site's CSS cannot break the frame and the
frame cannot leak into the site. Fonts are the homepage's own, loaded from `cocode.dk/fonts`.

`v1` is frozen to bug fixes once sites use it; anything else becomes `v2.js`.

## Develop

```bash
npm ci
npm run build                            # dist/: v1.js, v1.css and the test page
python3 -m http.server -d dist 8098      # every case on one page, at localhost:8098
```

## License

Apache-2.0
