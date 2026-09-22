# KaTeX Math Rendering

WordPress supports math out of the box: it writes standard MathML, which the browser renders. These renderings sometimes fall short, with oddly positioned strokes, thicker lines and the like, in the math fonts browsers ship with. This small plugin bundles KaTeX and uses its typesetting on the front end and in the editor, for the WordPress Math block and the inline math format. There are no separate blocks, it is an alternate rendering. To switch back to the WordPress rendering, deactivate the plugin and everything keeps working: Math blocks and inline math stay stored exactly as WordPress stores them, with both the LaTeX and the MathML in the post content.

- On the front end, KaTeX is loaded only on pages that contain math.
- A formula KaTeX cannot render is left to the browser's MathML.
- Formulas keep the size the browser gives MathML, the text size, rather than KaTeX's default enlargement. A theme that wants math larger next to its body font sets `math` and `.katex` alike, for example `math, .katex { font-size: 1.1em; }`.

Requires the Math block and inline math format of WordPress 7.0 or the Gutenberg plugin.

## What it looks like

The same post, as the browser renders the MathML on the left and as KaTeX renders it on the right, at the same font size. Taken with `npm run screenshots` on macOS, where Chrome and Safari use STIX Two Math for the native rendering and Firefox its own layout.

| Browser | Native MathML | KaTeX |
| --- | --- | --- |
| Chrome | ![](screenshots/chromium-mathml.png) | ![](screenshots/chromium-katex.png) |
| Safari | ![](screenshots/webkit-mathml.png) | ![](screenshots/webkit-katex.png) |
| Firefox | ![](screenshots/firefox-mathml.png) | ![](screenshots/firefox-katex.png) |

## Development

There is no build step. KaTeX is vendored in `vendor/katex`; `npm run update-katex [version]` updates it.

The end-to-end tests run against a [wp-env](https://www.npmjs.com/package/@wordpress/env) site with the latest Gutenberg release:

```sh
npm install
npm run wp-env start
npm run test:e2e
```

Point `.wp-env.override.json` at a local Gutenberg checkout to test against trunk.

`npm run screenshots` retakes the images above from the running site, in Chromium, WebKit and Firefox. Their content, `test/screenshots/content.html`, is generated from a list of formulas by `test/screenshots/build-content.cjs`, run from a directory that has temml installed (a Gutenberg checkout does).
