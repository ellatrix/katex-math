/**
 * Screenshots of each formula with and without the plugin, for the readme:
 * `npm run screenshots`. The native rendering depends on the math fonts of
 * the machine, so take them where readers are, on a desktop, not in CI.
 */

/**
 * External dependencies
 */
const fs = require( 'fs/promises' );
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

// Narrow enough that a row of the readme table, two images and the LaTeX,
// stays within the page, or GitHub scales the images down.
test.use( { viewport: { width: 440, height: 900 }, deviceScaleFactor: 2 } );

test( 'each formula with and without the plugin @screenshots', async ( {
	admin,
	editor,
	page,
	requestUtils,
	browserName,
} ) => {
	const content = await fs.readFile(
		path.join( __dirname, 'content.html' ),
		'utf8'
	);
	await admin.createNewPost();
	await editor.setContent( content );
	const postId = await editor.publishPost();

	const dir = path.join( __dirname, '..', '..', 'screenshots', browserName );
	await fs.rm( dir, { recursive: true, force: true } );
	await fs.mkdir( dir, { recursive: true } );

	const setup = async ( active ) => {
		if ( active ) {
			await requestUtils.activatePlugin( 'katex-math-rendering' );
		} else {
			await requestUtils.deactivatePlugin( 'katex-math-rendering' );
		}
		await page.goto( `/?p=${ postId }` );
		const post = page.locator( '.wp-block-post-content' );
		await expect(
			post.locator( active ? '.katex' : 'math' ).first()
		).toBeVisible();
		await page.evaluate( () => document.fonts.ready );
		// The admin bar is fixed, and Firefox scrolls to capture a tall
		// element, so the bar would be stamped into the image.
		await page.addStyleTag( {
			content: '#wpadminbar{display:none}html{margin-top:0!important}',
		} );
		const blocks = post.locator( '.wp-block-math' );
		return [
			[ 'inline', post.locator( 'p' ).first() ],
			...Array.from( { length: await blocks.count() }, ( _, i ) => [
				String( i + 1 ).padStart( 2, '0' ),
				blocks.nth( i ),
			] ),
		];
	};

	/**
	 * The paragraph as it is, a block cropped to the ink of its formula:
	 * the block is the width of the content column.
	 *
	 * @param {string} id    The item.
	 * @param {Object} block Its locator.
	 * @return {Promise<Object>} The box, in page coordinates.
	 */
	const ink = async ( id, block ) => {
		if ( id === 'inline' ) {
			return await block.boundingBox();
		}
		return await block.evaluate( ( element ) => {
			const box = element.getBoundingClientRect();
			let left = Infinity;
			let top = Infinity;
			let right = -Infinity;
			let bottom = -Infinity;
			for ( const child of element.querySelectorAll( '*' ) ) {
				const rect = child.getBoundingClientRect();
				// The wrappers span the column, KaTeX's struts are
				// invisible spacers, its MathML for assistive technology
				// is laid out though clipped to a pixel, and a stray wide
				// table (Safari) is cut at the block.
				if (
					! rect.width ||
					! rect.height ||
					rect.width >= box.width - 1 ||
					rect.left >= box.right ||
					rect.right <= box.left ||
					child.matches( '.pstrut, .katex-strut' ) ||
					child.closest( '.katex-mathml' )
				) {
					continue;
				}
				left = Math.min( left, Math.max( rect.left, box.left ) );
				top = Math.min( top, rect.top );
				right = Math.max( right, Math.min( rect.right, box.right ) );
				bottom = Math.max( bottom, rect.bottom );
			}
			// Nothing in view (Safari puts a tagged equation off-screen):
			// the empty block, as the reader sees it.
			if ( left === Infinity ) {
				return {
					x: box.left + window.scrollX,
					y: box.top + window.scrollY,
					width: box.width,
					height: box.height,
				};
			}
			const margin = 6;
			return {
				x: left - margin + window.scrollX,
				y: top - margin + window.scrollY,
				width: right - left + 2 * margin,
				height: bottom - top + 2 * margin,
			};
		} );
	};

	// Both renderings of a formula get the width of the wider one, so any
	// scaling of the readme's table applies to both alike.
	const modes = [
		[ 'mathml', false ],
		[ 'katex', true ],
	];
	const boxes = {};
	for ( const [ name, active ] of modes ) {
		for ( const [ id, block ] of await setup( active ) ) {
			boxes[ id ] ??= {};
			boxes[ id ][ name ] = await ink( id, block );
		}
	}
	for ( const [ name, active ] of modes ) {
		await setup( active );
		for ( const [ id, pair ] of Object.entries( boxes ) ) {
			const box = pair[ name ];
			const width = Math.max( pair.mathml.width, pair.katex.width );
			// Centred on the formula, but kept within the page, which
			// would otherwise cut the clip short (a tagged equation sits
			// at the right edge).
			const x = Math.min(
				Math.max( box.x - ( width - box.width ) / 2, 0 ),
				page.viewportSize().width - width
			);
			await page.screenshot( {
				path: path.join( dir, `${ id }-${ name }.png` ),
				scale: 'device',
				fullPage: true,
				clip: { x, y: box.y, width, height: box.height },
			} );
		}
	}
	await requestUtils.activatePlugin( 'katex-math-rendering' );
} );
