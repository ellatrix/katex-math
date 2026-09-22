/**
 * Screenshots of the same post with and without the plugin, for the readme:
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

test.use( { viewport: { width: 800, height: 900 }, deviceScaleFactor: 2 } );

test( 'front end with and without the plugin @screenshots', async ( {
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

	const dir = path.join( __dirname, '..', '..', 'screenshots' );
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
		await post.screenshot( {
			path: path.join( dir, `${ browserName }-${ name }.png` ),
			scale: 'device',
		} );
	}
	await requestUtils.activatePlugin( 'katex-math-rendering' );
} );
