# KaTeX Math Rendering

WordPress supports math out of the box: it writes standard MathML, which the browser renders. These renderings sometimes fall short, with oddly positioned strokes, thicker lines and the like, in the math fonts browsers ship with. This small plugin bundles KaTeX and uses its typesetting on the front end and in the editor, for the WordPress Math block and the inline math format. There are no separate blocks, it is an alternate rendering. To switch back to the WordPress rendering, deactivate the plugin and everything keeps working: Math blocks and inline math stay stored exactly as WordPress stores them, with both the LaTeX and the MathML in the post content.

- On the front end, KaTeX is loaded only on pages that contain math.
- A formula KaTeX cannot render is left to the browser's MathML.
- Formulas keep the size the browser gives MathML, the text size, rather than KaTeX's default enlargement. A theme that wants math larger next to its body font sets `math` and `.katex` alike, for example `math, .katex { font-size: 1.1em; }`.

Requires the Math block and inline math format of WordPress 7.0 or the Gutenberg plugin.

## What it looks like

Each formula as the browser renders the MathML on the left and as KaTeX renders it on the right, at the same font size. Taken with `npm run screenshots` on macOS, where Chrome and Safari use STIX Two Math for the native rendering and Firefox its own layout. The empty native tile for the tagged equation in Safari is what Safari shows: it lays the `\tag` table out a million pixels wide, and the equation ends up far off-screen.

<!-- screenshots:start -->

### Chrome

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="screenshots/chromium/inline-mathml.png" width="380"> | <img src="screenshots/chromium/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="screenshots/chromium/01-mathml.png" width="179"> | <img src="screenshots/chromium/01-katex.png" width="179"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="screenshots/chromium/02-mathml.png" width="217"> | <img src="screenshots/chromium/02-katex.png" width="217"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="screenshots/chromium/03-mathml.png" width="125"> | <img src="screenshots/chromium/03-katex.png" width="125"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="screenshots/chromium/04-mathml.png" width="147"> | <img src="screenshots/chromium/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="screenshots/chromium/05-mathml.png" width="114"> | <img src="screenshots/chromium/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="screenshots/chromium/06-mathml.png" width="209"> | <img src="screenshots/chromium/06-katex.png" width="209"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="screenshots/chromium/07-mathml.png" width="201"> | <img src="screenshots/chromium/07-katex.png" width="201"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="screenshots/chromium/08-mathml.png" width="149"> | <img src="screenshots/chromium/08-katex.png" width="149"> |
| `\boxed{E = mc^2}` | <img src="screenshots/chromium/09-mathml.png" width="95"> | <img src="screenshots/chromium/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="screenshots/chromium/10-mathml.png" width="392"> | <img src="screenshots/chromium/10-katex.png" width="338"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="screenshots/chromium/11-mathml.png" width="114"> | <img src="screenshots/chromium/11-katex.png" width="114"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="screenshots/chromium/12-mathml.png" width="207"> | <img src="screenshots/chromium/12-katex.png" width="207"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="screenshots/chromium/13-mathml.png" width="153"> | <img src="screenshots/chromium/13-katex.png" width="153"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="screenshots/chromium/14-mathml.png" width="116"> | <img src="screenshots/chromium/14-katex.png" width="116"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="screenshots/chromium/15-mathml.png" width="275"> | <img src="screenshots/chromium/15-katex.png" width="275"> |
| `a \smash{\frac{1}{2}} b` | <img src="screenshots/chromium/16-mathml.png" width="43"> | <img src="screenshots/chromium/16-katex.png" width="43"> |

### Safari

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="screenshots/webkit/inline-mathml.png" width="380"> | <img src="screenshots/webkit/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="screenshots/webkit/01-mathml.png" width="175"> | <img src="screenshots/webkit/01-katex.png" width="175"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="screenshots/webkit/02-mathml.png" width="217"> | <img src="screenshots/webkit/02-katex.png" width="217"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="screenshots/webkit/03-mathml.png" width="125"> | <img src="screenshots/webkit/03-katex.png" width="125"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="screenshots/webkit/04-mathml.png" width="147"> | <img src="screenshots/webkit/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="screenshots/webkit/05-mathml.png" width="114"> | <img src="screenshots/webkit/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="screenshots/webkit/06-mathml.png" width="207"> | <img src="screenshots/webkit/06-katex.png" width="207"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="screenshots/webkit/07-mathml.png" width="213"> | <img src="screenshots/webkit/07-katex.png" width="213"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="screenshots/webkit/08-mathml.png" width="149"> | <img src="screenshots/webkit/08-katex.png" width="149"> |
| `\boxed{E = mc^2}` | <img src="screenshots/webkit/09-mathml.png" width="95"> | <img src="screenshots/webkit/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="screenshots/webkit/10-mathml.png" width="380"> | <img src="screenshots/webkit/10-katex.png" width="332"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="screenshots/webkit/11-mathml.png" width="116"> | <img src="screenshots/webkit/11-katex.png" width="116"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="screenshots/webkit/12-mathml.png" width="207"> | <img src="screenshots/webkit/12-katex.png" width="207"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="screenshots/webkit/13-mathml.png" width="146"> | <img src="screenshots/webkit/13-katex.png" width="146"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="screenshots/webkit/14-mathml.png" width="109"> | <img src="screenshots/webkit/14-katex.png" width="109"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="screenshots/webkit/15-mathml.png" width="276"> | <img src="screenshots/webkit/15-katex.png" width="276"> |
| `a \smash{\frac{1}{2}} b` | <img src="screenshots/webkit/16-mathml.png" width="43"> | <img src="screenshots/webkit/16-katex.png" width="43"> |

### Firefox

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="screenshots/firefox/inline-mathml.png" width="380"> | <img src="screenshots/firefox/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="screenshots/firefox/01-mathml.png" width="176"> | <img src="screenshots/firefox/01-katex.png" width="176"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="screenshots/firefox/02-mathml.png" width="218"> | <img src="screenshots/firefox/02-katex.png" width="218"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="screenshots/firefox/03-mathml.png" width="126"> | <img src="screenshots/firefox/03-katex.png" width="126"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="screenshots/firefox/04-mathml.png" width="147"> | <img src="screenshots/firefox/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="screenshots/firefox/05-mathml.png" width="114"> | <img src="screenshots/firefox/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="screenshots/firefox/06-mathml.png" width="207"> | <img src="screenshots/firefox/06-katex.png" width="207"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="screenshots/firefox/07-mathml.png" width="209"> | <img src="screenshots/firefox/07-katex.png" width="209"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="screenshots/firefox/08-mathml.png" width="150"> | <img src="screenshots/firefox/08-katex.png" width="150"> |
| `\boxed{E = mc^2}` | <img src="screenshots/firefox/09-mathml.png" width="95"> | <img src="screenshots/firefox/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="screenshots/firefox/10-mathml.png" width="237"> | <img src="screenshots/firefox/10-katex.png" width="237"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="screenshots/firefox/11-mathml.png" width="115"> | <img src="screenshots/firefox/11-katex.png" width="115"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="screenshots/firefox/12-mathml.png" width="212"> | <img src="screenshots/firefox/12-katex.png" width="212"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="screenshots/firefox/13-mathml.png" width="150"> | <img src="screenshots/firefox/13-katex.png" width="150"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="screenshots/firefox/14-mathml.png" width="121"> | <img src="screenshots/firefox/14-katex.png" width="121"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="screenshots/firefox/15-mathml.png" width="276"> | <img src="screenshots/firefox/15-katex.png" width="276"> |
| `a \smash{\frac{1}{2}} b` | <img src="screenshots/firefox/16-mathml.png" width="43"> | <img src="screenshots/firefox/16-katex.png" width="43"> |

<!-- screenshots:end -->

## Development

There is no build step. KaTeX is vendored in `vendor/katex`; `npm run update-katex [version]` updates it.

The end-to-end tests run against a [wp-env](https://www.npmjs.com/package/@wordpress/env) site with the latest Gutenberg release:

```sh
npm install
npm run wp-env start
npm run test:e2e
```

Point `.wp-env.override.json` at a local Gutenberg checkout to test against trunk.

`npm run screenshots` retakes the images above from the running site, in Chromium, WebKit and Firefox, and rewrites the tables. The formulas are listed in `test/screenshots/formulas.cjs`; after changing the list, regenerate `content.html` with `test/screenshots/build-content.cjs`, run from a directory that has temml installed (a Gutenberg checkout does).
