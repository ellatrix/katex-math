# What it looks like

Each formula as the browser renders the MathML on the left and as KaTeX renders it on the right, at the same font size. Taken with `npm run screenshots` on macOS, where Chrome and Safari use STIX Two Math for the native rendering and Firefox its own layout. The empty native tile for the tagged equation in Safari is what Safari shows: it lays the `\tag` table out a million pixels wide, and the equation ends up far off-screen.

<!-- screenshots:start -->

### Chrome

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="chromium/inline-mathml.png" width="380"> | <img src="chromium/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="chromium/01-mathml.png" width="179"> | <img src="chromium/01-katex.png" width="179"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="chromium/02-mathml.png" width="217"> | <img src="chromium/02-katex.png" width="217"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="chromium/03-mathml.png" width="125"> | <img src="chromium/03-katex.png" width="125"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="chromium/04-mathml.png" width="147"> | <img src="chromium/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="chromium/05-mathml.png" width="114"> | <img src="chromium/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="chromium/06-mathml.png" width="209"> | <img src="chromium/06-katex.png" width="209"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="chromium/07-mathml.png" width="201"> | <img src="chromium/07-katex.png" width="201"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="chromium/08-mathml.png" width="149"> | <img src="chromium/08-katex.png" width="149"> |
| `\boxed{E = mc^2}` | <img src="chromium/09-mathml.png" width="95"> | <img src="chromium/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="chromium/10-mathml.png" width="392"> | <img src="chromium/10-katex.png" width="392"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="chromium/11-mathml.png" width="114"> | <img src="chromium/11-katex.png" width="114"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="chromium/12-mathml.png" width="207"> | <img src="chromium/12-katex.png" width="207"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="chromium/13-mathml.png" width="153"> | <img src="chromium/13-katex.png" width="153"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="chromium/14-mathml.png" width="116"> | <img src="chromium/14-katex.png" width="116"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="chromium/15-mathml.png" width="275"> | <img src="chromium/15-katex.png" width="275"> |

### Safari

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="webkit/inline-mathml.png" width="380"> | <img src="webkit/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="webkit/01-mathml.png" width="175"> | <img src="webkit/01-katex.png" width="175"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="webkit/02-mathml.png" width="217"> | <img src="webkit/02-katex.png" width="217"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="webkit/03-mathml.png" width="125"> | <img src="webkit/03-katex.png" width="125"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="webkit/04-mathml.png" width="147"> | <img src="webkit/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="webkit/05-mathml.png" width="114"> | <img src="webkit/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="webkit/06-mathml.png" width="207"> | <img src="webkit/06-katex.png" width="207"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="webkit/07-mathml.png" width="213"> | <img src="webkit/07-katex.png" width="213"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="webkit/08-mathml.png" width="149"> | <img src="webkit/08-katex.png" width="149"> |
| `\boxed{E = mc^2}` | <img src="webkit/09-mathml.png" width="95"> | <img src="webkit/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="webkit/10-mathml.png" width="380"> | <img src="webkit/10-katex.png" width="380"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="webkit/11-mathml.png" width="116"> | <img src="webkit/11-katex.png" width="116"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="webkit/12-mathml.png" width="207"> | <img src="webkit/12-katex.png" width="207"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="webkit/13-mathml.png" width="146"> | <img src="webkit/13-katex.png" width="146"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="webkit/14-mathml.png" width="109"> | <img src="webkit/14-katex.png" width="109"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="webkit/15-mathml.png" width="276"> | <img src="webkit/15-katex.png" width="276"> |

### Firefox

| LaTeX | Native MathML | KaTeX |
| --- | --- | --- |
| Euler's identity `e^{i\pi} + 1 = 0` is often called the most beautiful equation, and here it sits inline. | <img src="firefox/inline-mathml.png" width="380"> | <img src="firefox/inline-katex.png" width="380"> |
| `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` | <img src="firefox/01-mathml.png" width="176"> | <img src="firefox/01-katex.png" width="176"> |
| `\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}` | <img src="firefox/02-mathml.png" width="218"> | <img src="firefox/02-katex.png" width="218"> |
| `\cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + x}}}` | <img src="firefox/03-mathml.png" width="126"> | <img src="firefox/03-katex.png" width="126"> |
| `\left( \frac{a}{b} \right)^{2} + \left[ \sum_{k} x_k \right]` | <img src="firefox/04-mathml.png" width="147"> | <img src="firefox/04-katex.png" width="147"> |
| `\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` | <img src="firefox/05-mathml.png" width="114"> | <img src="firefox/05-katex.png" width="114"> |
| `f(x) = \begin{cases} x^2 & \text{if } x \ge 0 \\ -x & \text{otherwise} \end{cases}` | <img src="firefox/06-mathml.png" width="207"> | <img src="firefox/06-katex.png" width="207"> |
| `\hat{x} + \vec{v} + \widehat{abc} + \overline{z} + \tilde{n} + \dot{y}` | <img src="firefox/07-mathml.png" width="209"> | <img src="firefox/07-katex.png" width="209"> |
| `\overbrace{a + b + c}^{\text{sum}} + \underbrace{d \cdot e}_{\text{product}}` | <img src="firefox/08-mathml.png" width="150"> | <img src="firefox/08-katex.png" width="150"> |
| `\boxed{E = mc^2}` | <img src="firefox/09-mathml.png" width="95"> | <img src="firefox/09-katex.png" width="95"> |
| `E = mc^2 \tag{1}` | <img src="firefox/10-mathml.png" width="237"> | <img src="firefox/10-katex.png" width="237"> |
| `\cancel{a} + \bcancel{b} + \xcancel{c} + \sout{d}` | <img src="firefox/11-mathml.png" width="115"> | <img src="firefox/11-katex.png" width="115"> |
| `A \xrightarrow{\;f\;} B \xleftarrow[\text{under}]{\text{over}} C \xrightleftharpoons{k} D` | <img src="firefox/12-mathml.png" width="212"> | <img src="firefox/12-katex.png" width="212"> |
| `\begin{CD} A @>a>> B \\ @VbVV @VVcV \\ C @>>d> D \end{CD}` | <img src="firefox/13-mathml.png" width="150"> | <img src="firefox/13-katex.png" width="150"> |
| `\sum_{\substack{0 < i < m \\ 0 < j < n}} P(i, j)` | <img src="firefox/14-mathml.png" width="121"> | <img src="firefox/14-katex.png" width="121"> |
| `\underbrace{x_1 + x_2 + \cdots + x_n}_{n \text{ terms}} = \overbrace{y}^{\mathclap{\text{wide label here}}}` | <img src="firefox/15-mathml.png" width="276"> | <img src="firefox/15-katex.png" width="276"> |

<!-- screenshots:end -->
