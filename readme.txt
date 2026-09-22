=== KaTeX Math Rendering ===
Contributors: ellatrix
Tags: math, latex, katex, mathml
Requires at least: 6.9
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Renders the math of the Math block and the inline math format with KaTeX.

== Description ==

WordPress saves math as MathML, which browsers render on their own and which works in feeds, email and anywhere else the content goes. This plugin is for sites that want KaTeX's typesetting on top of that.

* The content is not changed. Posts keep the MathML, with the LaTeX source inside it. Deactivate the plugin and everything still renders.
* On the front end, KaTeX is loaded only on pages that contain math, and each formula is replaced by its KaTeX rendering.
* In the editor, the Math block and inline math are shown with KaTeX as well. Only the display changes, what is saved stays the same.
* A formula KaTeX cannot render is left to the browser's MathML.
* Formulas keep the text size the browser gives MathML rather than KaTeX's default enlargement. A theme that wants math larger sets `math` and `.katex` alike.

KaTeX is bundled with the plugin, fonts included. Nothing is loaded from another site.

== Development ==

There is no build step. `bin/update-katex.sh [version]` fetches a KaTeX release from npm into `vendor/katex`.

== Changelog ==

= 0.1.0 =
* Initial release.
