/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * Internal dependencies
 */
const { formula } = require( './formula' );

test.describe( 'Inline math editing', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'First.' },
		} );
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content: `Inline ${ formula(
					'\\frac{1}{2}',
					'<mfrac><mn>1</mn><mn>2</mn></mfrac>'
				) } end.`,
			},
		} );
	} );

	const rendered = ( formulas ) =>
		formulas.evaluateAll( ( elements ) =>
			elements.map(
				( element ) => !! element.shadowRoot?.querySelector( '.katex' )
			)
		);

	test( 'is deleted with Backspace and restored by undo', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		await editor.canvas.getByText( 'end.' ).click();
		await page.keyboard.press( 'Home' );
		// Past "Inline " and over the formula, which the caret skips.
		for ( let i = 0; i < 8; i++ ) {
			await page.keyboard.press( 'ArrowRight' );
		}
		await page.keyboard.press( 'Backspace' );
		await expect( formulas ).toHaveCount( 0 );
		expect( await editor.getEditedPostContent() ).toContain(
			'<p>Inline  end.</p>'
		);

		await pageUtils.pressKeys( 'primary+z' );
		await expect( formulas ).toHaveCount( 1 );
		await expect.poll( () => rendered( formulas ) ).toEqual( [ true ] );
		expect( await editor.getEditedPostContent() ).toContain( '<mfrac>' );
	} );

	test( 'can be copied and pasted', async ( { editor, page, pageUtils } ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		await formulas.first().click();
		await expect( formulas.first() ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
		await pageUtils.pressKeys( 'primary+c' );
		await editor.canvas.getByText( 'end.' ).click();
		await page.keyboard.press( 'End' );
		await page.keyboard.type( ' ' );
		await pageUtils.pressKeys( 'primary+v' );

		await expect( formulas ).toHaveCount( 2 );
		await expect
			.poll( () => rendered( formulas ) )
			.toEqual( [ true, true ] );
		const content = await editor.getEditedPostContent();
		expect( content.match( /<math/g ) ).toHaveLength( 2 );
		expect( content ).not.toContain( 'katex' );
	} );

	test( 'stays selected when clicked again', async ( {
		editor,
		browserName,
	} ) => {
		test.fixme(
			browserName === 'chromium',
			'Chromium: a click on the selected wrapper clears the selection (Gutenberg, select-object.js).'
		);
		const selected = editor.canvas.locator( '[data-rich-text-bogus]' );
		await selected.click();
		await expect( selected ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
		await selected.click();
		await expect( selected ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
	} );

	test( 'renders a saved post on reload', async ( { editor, page } ) => {
		await editor.saveDraft();
		await page.reload();
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		await expect( formulas ).toHaveCount( 1 );
		await expect.poll( () => rendered( formulas ) ).toEqual( [ true ] );
	} );
} );
