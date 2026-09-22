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

const { inline, blocks } = require( './formulas.cjs' );

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
const inlineMath = `<math data-latex="${ inline.latex }">${ mathml( inline.latex, false ) }</math>`;
const content = [
	`<!-- wp:paragraph -->\n<p>${ inline.before }${ inlineMath }${ inline.after }</p>\n<!-- /wp:paragraph -->`,
	...blocks.map(
		( latex ) =>
			`<!-- wp:math -->\n<div class="wp-block-math"><math display="block">${ mathml( latex, true ) }</math></div>\n<!-- /wp:math -->`
	),
];
fs.writeFileSync(
	path.join( __dirname, 'content.html' ),
	content.join( '\n\n' ) + '\n'
);
