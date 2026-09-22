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

test.use( { viewport: { width: 540, height: 900 }, deviceScaleFactor: 2 } );

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

	for ( const [ name, active ] of [
		[ 'mathml', false ],
		[ 'katex', true ],
	] ) {
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
		const items = [
			[ 'inline', post.locator( 'p' ).first() ],
			...Array.from( { length: await blocks.count() }, ( _, i ) => [
				String( i + 1 ).padStart( 2, '0' ),
				blocks.nth( i ),
			] ),
		];
		for ( const [ id, block ] of items ) {
			// The paragraph as it is, a block cropped to the ink of its
			// formula: the block is the width of the content column.
			const clip =
				id === 'inline'
					? await block.boundingBox()
					: await block.evaluate( ( element ) => {
							const box = element.getBoundingClientRect();
							let left = Infinity;
							let top = Infinity;
							let right = -Infinity;
							let bottom = -Infinity;
							for ( const child of element.querySelectorAll(
								'*'
							) ) {
								const rect = child.getBoundingClientRect();
								// The wrappers span the column, KaTeX's struts
								// are invisible spacers, and a stray wide table
								// (Safari) is cut at the block.
								if (
									! rect.width ||
									! rect.height ||
									rect.width >= box.width - 1 ||
									rect.left >= box.right ||
									rect.right <= box.left ||
									child.matches( '.pstrut, .katex-strut' ) ||
									// KaTeX's MathML for assistive technology is
									// laid out, though clipped to a pixel.
									child.closest( '.katex-mathml' )
								) {
									continue;
								}
								left = Math.min(
									left,
									Math.max( rect.left, box.left )
								);
								top = Math.min( top, rect.top );
								right = Math.max(
									right,
									Math.min( rect.right, box.right )
								);
								bottom = Math.max( bottom, rect.bottom );
							}
							// Nothing in view (Safari puts a tagged equation
							// off-screen): the empty block, as the reader sees it.
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
			await page.screenshot( {
				path: path.join( dir, `${ id }-${ name }.png` ),
				scale: 'device',
				fullPage: true,
				clip,
			} );
		}
	}
	await requestUtils.activatePlugin( 'katex-math-rendering' );
} );
