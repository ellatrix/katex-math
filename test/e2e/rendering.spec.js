/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * Internal dependencies
 */
const { formula } = require( './formula' );

test.describe( 'Rendering', () => {
	test( 'shows KaTeX in the editor and saves the MathML unchanged', async ( {
		admin,
		editor,
		page,
	} ) => {
		const errors = [];
		page.on( 'pageerror', ( error ) => errors.push( String( error ) ) );

		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: '\\int_0^1 x^2 \\, dx = \\frac{1}{3}' },
		} );
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content: `Inline ${ formula(
					'\\sqrt{a^2+b^2}',
					'<msqrt><mrow><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup></mrow></msqrt>'
				) } end.`,
			},
		} );
		// Something KaTeX rejects, to check the fallback.
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: '\\notacommand{x}' },
		} );

		const math = editor.canvas.locator( 'math' );
		await expect( math ).toHaveCount( 3 );
		await expect
			.poll( () =>
				math.evaluateAll( ( elements ) =>
					elements.map( ( element ) => {
						const root = element.parentElement.shadowRoot;
						return {
							katex: !! root?.querySelector( '.katex' ),
							// The MathML is collapsed only when there is a
							// rendering to show instead.
							collapsed:
								root?.querySelector( 'slot' )?.className ===
								'is-replaced',
						};
					} )
				)
			)
			.toEqual( [
				{ katex: true, collapsed: true },
				{ katex: true, collapsed: true },
				{ katex: false, collapsed: false },
			] );

		// The rendering is in shadow roots the editor does not see: what is
		// saved is the MathML with the LaTeX annotation.
		const content = await editor.getEditedPostContent();
		expect( content ).not.toContain( 'katex' );
		expect( content ).toContain( '<msqrt>' );
		expect( content ).toContain(
			'<annotation encoding="application/x-tex">\\sqrt{a^2+b^2}</annotation>'
		);
		expect( errors ).toEqual( [] );
	} );

	test( 'replaces the MathML with KaTeX on the front end', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: 'x - y' },
		} );
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content: `Inline ${ formula(
					'\\frac{1}{2}',
					'<mfrac><mn>1</mn><mn>2</mn></mfrac>'
				) } here.`,
			},
		} );
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: '\\notacommand{x}' },
		} );
		const postId = await editor.publishPost();

		await page.goto( `/?p=${ postId }` );
		const front = await page.evaluate( () => ( {
			katex: document.querySelectorAll( '.katex' ).length,
			display: document.querySelectorAll( '.katex-display' ).length,
			// KaTeX renders its own hidden MathML, so only the formulas
			// outside of it are the browser's.
			nativeMath: [ ...document.querySelectorAll( 'math' ) ].filter(
				( element ) => ! element.closest( '.katex' )
			).length,
			stylesheet: !! document.getElementById( 'katex-math-lib-css' ),
			// The source is left alone by `wptexturize()`: the minus is
			// not turned into a dash.
			source: document.querySelector( '.katex annotation' )?.textContent,
		} ) );
		expect( front ).toEqual( {
			katex: 2,
			display: 1,
			nativeMath: 1,
			stylesheet: true,
			source: 'x - y',
		} );
	} );

	test( 'does not load KaTeX on a page without math', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'No math here.' },
		} );
		const postId = await editor.publishPost();

		await page.goto( `/?p=${ postId }` );
		await expect( page.locator( '#katex-math-lib-css' ) ).toHaveCount( 0 );
		await expect( page.locator( '#katex-math-lib-js' ) ).toHaveCount( 0 );
	} );
} );
