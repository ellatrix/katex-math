/**
 * Writes content.html: the formulas of the comparison, as the editor saves
 * them, so the screenshots can be retaken from the same source. Needs temml,
 * which the editor's converter uses: run from a Gutenberg checkout, e.g.
 * `node /path/to/katex-math/test/screenshots/build-content.cjs`.
 */
const fs = require( 'fs' );
const path = require( 'path' );
// Resolved from the directory the script is run in.
const temml = require(
	require.resolve( 'temml', { paths: [ process.cwd() ] } )
);

const formulas = [
	'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
	'\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
	'\\cfrac{1}{1 + \\cfrac{1}{1 + \\cfrac{1}{1 + x}}}',
	'\\left( \\frac{a}{b} \\right)^{2} + \\left[ \\sum_{k} x_k \\right]',
	'\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}',
	'f(x) = \\begin{cases} x^2 & \\text{if } x \\ge 0 \\\\ -x & \\text{otherwise} \\end{cases}',
	'\\hat{x} + \\vec{v} + \\widehat{abc} + \\overline{z} + \\tilde{n} + \\dot{y}',
	'\\overbrace{a + b + c}^{\\text{sum}} + \\underbrace{d \\cdot e}_{\\text{product}}',
	'\\boxed{E = mc^2}',
	'E = mc^2 \\tag{1}',
	'\\cancel{a} + \\bcancel{b} + \\xcancel{c} + \\sout{d}',
	'A \\xrightarrow{\\;f\\;} B \\xleftarrow[\\text{under}]{\\text{over}} C \\xrightleftharpoons{k} D',
	'\\begin{CD} A @>a>> B \\\\ @VbVV @VVcV \\\\ C @>>d> D \\end{CD}',
	'\\sum_{\\substack{0 < i < m \\\\ 0 < j < n}} P(i, j)',
	'\\underbrace{x_1 + x_2 + \\cdots + x_n}_{n \\text{ terms}} = \\overbrace{y}^{\\mathclap{\\text{wide label here}}}',
	'a \\smash{\\frac{1}{2}} b',
];

/**
 * What the editor's converter produces: the inside of temml's `<math>`, the
 * alignment of cells as an attribute, no classes.
 *
 * @param {string}  latex       The LaTeX source.
 * @param {boolean} displayMode Whether the formula is a block.
 * @return {string} The children of the `<math>` element.
 */
function mathml( latex, displayMode ) {
	return temml
		.renderToString( latex, {
			displayMode,
			annotate: true,
			throwOnError: true,
		} )
		.replace( /^<math[^>]*>|<\/math>$/g, '' )
		.replace( /<mtd class="tml-(right|left)"/g, '<mtd columnalign="$1"' )
		.replace( /\sclass="[^"]*"/g, '' );
}

// The inline format and the Math block wrap it as they save it.
const inlineLatex = 'e^{i\\pi} + 1 = 0';
const inline = `<math data-latex="${ inlineLatex }">${ mathml( inlineLatex, false ) }</math>`;
const blocks = [
	`<!-- wp:paragraph -->\n<p>Euler's identity ${ inline } is often called the most beautiful equation, and here it sits inline.</p>\n<!-- /wp:paragraph -->`,
	...formulas.map(
		( latex ) =>
			`<!-- wp:math -->\n<div class="wp-block-math"><math display="block">${ mathml( latex, true ) }</math></div>\n<!-- /wp:math -->`
	),
];
fs.writeFileSync(
	path.join( __dirname, 'content.html' ),
	blocks.join( '\n\n' ) + '\n'
);
