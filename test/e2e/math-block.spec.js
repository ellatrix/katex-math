/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Math block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'follows the formula as it is edited', async ( { editor, page } ) => {
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: 'x^2' },
		} );
		const block = editor.canvas.locator( '.wp-block-math' );
		const rendering = () =>
			block.evaluate( ( element ) => ( {
				// KaTeX pads its markup with zero-width spaces, and lays a
				// fraction out denominator first, so the text is checked for
				// the simple formulas and the structure for the fraction.
				katex: element.shadowRoot
					?.querySelector( '.katex' )
					?.textContent.replace( /\u200b/g, '' ),
				fraction: !! element.shadowRoot?.querySelector( '.mfrac' ),
				collapsed:
					element.shadowRoot?.querySelector( 'slot' )?.className ===
					'is-replaced',
			} ) );
		await expect
			.poll( rendering )
			.toEqual( { katex: 'x2', fraction: false, collapsed: true } );

		// The block is selected, so its popover is open.
		const latex = page.getByRole( 'textbox', {
			name: 'LaTeX math syntax',
		} );
		await latex.fill( '\\frac{x^2}{2}' );
		await expect
			.poll( rendering )
			.toEqual( { katex: '2x2', fraction: true, collapsed: true } );

		// A formula KaTeX rejects falls back to the MathML, and back again.
		await latex.fill( '\\notacommand{x}' );
		await expect
			.poll( rendering )
			.toEqual( { katex: undefined, fraction: false, collapsed: false } );
		await latex.fill( 'y^3' );
		await expect
			.poll( rendering )
			.toEqual( { katex: 'y3', fraction: false, collapsed: true } );

		expect( await editor.getEditedPostContent() ).toContain(
			'<annotation encoding="application/x-tex">y^3</annotation>'
		);
	} );

	test( 'renders a saved post on reload', async ( { editor, page } ) => {
		await editor.insertBlock( {
			name: 'core/math',
			attributes: { latex: '\\sqrt{2}' },
		} );
		await editor.saveDraft();
		await page.reload();

		const block = editor.canvas.locator( '.wp-block-math' );
		await expect
			.poll( () =>
				block.evaluate( ( element ) =>
					element.shadowRoot
						?.querySelector( '.katex' )
						?.textContent.replace( /\u200b/g, '' )
				)
			)
			.toBe( '2' );
		// Not an inline box: the collapsed MathML must not add a line.
		expect(
			await block.evaluate( ( element ) => {
				const math = element.querySelector( 'math' );
				return [
					window.getComputedStyle( math ).display,
					math.getBoundingClientRect().height,
				];
			} )
		).toEqual( [ 'block', 0 ] );
	} );
} );
