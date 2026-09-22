# KaTeX Math Rendering

Contributors: ellatrix
Tags: math, latex, katex, mathml
Requires at least: 7.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Renders the math of the Math block and the inline math format with KaTeX.

## Description

WordPress supports math out of the box: it writes standard MathML, which the browser renders. These renderings sometimes fall short, with oddly positioned strokes, thicker lines and the like, in the math fonts browsers ship with. This small plugin bundles KaTeX and uses its typesetting on the front end and in the editor, for the WordPress Math block and the inline math format. There are no separate blocks, it is an alternate rendering. To switch back to the WordPress rendering, deactivate the plugin and everything keeps working: Math blocks and inline math stay stored exactly as WordPress stores them, with both the LaTeX and the MathML in the post content.

- On the front end, KaTeX is loaded only on pages that contain math.
- A formula KaTeX cannot render is left to the browser's MathML.
- Formulas keep the size the browser gives MathML, the text size, rather than KaTeX's default enlargement. A theme that wants math larger next to its body font sets `math` and `.katex` alike, for example `math, .katex { font-size: 1.1em; }`.

Requires the Math block and inline math format of WordPress 7.0 or the Gutenberg plugin.

[See how it looks](https://github.com/ellatrix/katex-math/blob/trunk/screenshots/README.md): every formula rendered by Chrome, Safari and Firefox, with and without the plugin.

## Third-party code

The plugin bundles [KaTeX](https://katex.org/) 0.18.7, unmodified, in `vendor/katex`: the minified script and stylesheet and the fonts of its npm release, under the MIT license (see `vendor/katex/LICENSE`). Its source is at https://github.com/KaTeX/KaTeX.

## Development

Development happens at https://github.com/ellatrix/katex-math. There is no build step. KaTeX is vendored in `vendor/katex`; `npm run update-katex [version]` updates it.

The end-to-end tests run against a [wp-env](https://www.npmjs.com/package/@wordpress/env) site with the latest Gutenberg release:

```sh
npm install
npm run wp-env start
npm run test:e2e
```

Point `.wp-env.override.json` at a local Gutenberg checkout to test against trunk.

`npm run screenshots` retakes the images of `screenshots/README.md` from the running site, in Chromium, WebKit and Firefox, and rewrites its tables. The formulas are listed in `test/screenshots/formulas.cjs`; after changing the list, regenerate `content.html` with `test/screenshots/build-content.cjs`, run from a directory that has temml installed (a Gutenberg checkout does).

`npm run plugin-zip` packs the committed plugin files into `katex-math.zip`.

## Changelog

### 0.1.0

- Initial release.
