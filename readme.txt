=== KaTeX Math Rendering ===
Contributors: ellatrix
Tags: math, latex, katex, mathml
Requires at least: 7.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.1.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Renders the math of the Math block and the inline math format with KaTeX.

== Description ==

WordPress supports math out of the box: it writes standard MathML, which the browser renders. These renderings sometimes fall short, with oddly positioned strokes, thicker lines and the like, in the math fonts browsers ship with. This small plugin bundles KaTeX and uses its typesetting on the front end and in the editor, for the WordPress Math block and the inline math format. There are no separate blocks, it is an alternate rendering. To switch back to the WordPress rendering, deactivate the plugin and everything keeps working: Math blocks and inline math stay stored exactly as WordPress stores them, with both the LaTeX and the MathML in the post content.

* On the front end, KaTeX is loaded only on pages that contain math.
* A formula KaTeX cannot render is left to the browser's MathML.
* Formulas keep the text size the browser gives MathML rather than KaTeX's default enlargement. A theme that wants math larger sets `math` and `.katex` alike.

== Third-party code ==

The plugin bundles [KaTeX](https://katex.org/) 0.18.7, unmodified, in `vendor/katex`: the minified script and stylesheet and the fonts of its npm release, under the MIT license (see `vendor/katex/LICENSE`). Its source is at https://github.com/KaTeX/KaTeX. Development happens at https://github.com/ellatrix/katex-math.

== Changelog ==

= 0.1.0 =
* Initial release.
