/**
 * Writes the comparison tables of the readme from the screenshots, between
 * the `screenshots:start` and `screenshots:end` markers: one table per
 * browser, one row per formula, with its LaTeX and the two renderings.
 */
const fs = require( 'fs' );
const path = require( 'path' );
const { inline, blocks } = require( './formulas.cjs' );

const root = path.join( __dirname, '..', '..' );
const browsers = [
	[ 'chromium', 'Chrome' ],
	[ 'webkit', 'Safari' ],
	[ 'firefox', 'Firefox' ],
];

/**
 * The width of a PNG, from its header.
 *
 * @param {string} file The path of the file.
 * @return {number} The width in pixels.
 */
function width( file ) {
	const header = Buffer.alloc( 24 );
	const fd = fs.openSync( file, 'r' );
	fs.readSync( fd, header, 0, 24, 0 );
	fs.closeSync( fd );
	return header.readUInt32BE( 16 );
}

/**
 * An image cell, shown at half its pixel size: the screenshots are taken at
 * a device scale of 2.
 *
 * @param {string} file The path of the image, relative to the readme.
 * @return {string} The cell's HTML, or a dash when the image is missing.
 */
function image( file ) {
	if ( ! fs.existsSync( path.join( root, file ) ) ) {
		return '—';
	}
	return `<img src="${ file }" width="${ Math.round(
		width( path.join( root, file ) ) / 2
	) }">`;
}

/**
 * LaTeX in a table cell.
 *
 * @param {string} latex The source.
 * @return {string} A code span, with the pipes escaped for the table.
 */
function code( latex ) {
	return '`' + latex.replace( /\|/g, '\\|' ) + '`';
}

let markdown = '';
for ( const [ dir, name ] of browsers ) {
	const rows = [
		[
			`${ inline.before }${ code( inline.latex ) }${ inline.after }`,
			'inline',
		],
		...blocks.map( ( latex, i ) => [
			code( latex ),
			String( i + 1 ).padStart( 2, '0' ),
		] ),
	];
	markdown += `\n### ${ name }\n\n| LaTeX | Native MathML | KaTeX |\n| --- | --- | --- |\n`;
	for ( const [ source, id ] of rows ) {
		markdown += `| ${ source } | ${ image(
			`screenshots/${ dir }/${ id }-mathml.png`
		) } | ${ image( `screenshots/${ dir }/${ id }-katex.png` ) } |\n`;
	}
}

const readme = path.join( root, 'README.md' );
const start = '<!-- screenshots:start -->';
const end = '<!-- screenshots:end -->';
const text = fs.readFileSync( readme, 'utf8' );
const from = text.indexOf( start ) + start.length;
const to = text.indexOf( end );
fs.writeFileSync(
	readme,
	text.slice( 0, from ) + '\n' + markdown + '\n' + text.slice( to )
);
