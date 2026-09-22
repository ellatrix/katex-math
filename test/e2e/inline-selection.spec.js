/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

/**
 * Internal dependencies
 */
const { formula } = require( './formula' );

test.describe( 'Inline math', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		// A second block, so the editing host is the canvas root rather
		// than the paragraph, as in any real post.
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'First.' },
		} );
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content: `Inline ${ formula(
					'\\sqrt{a^2+b^2}',
					'<msqrt><mrow><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup></mrow></msqrt>'
				) } and ${ formula(
					'\\frac{1}{2}',
					'<mfrac><mn>1</mn><mn>2</mn></mfrac>'
				) } end.`,
			},
		} );
	} );

	test( 'is selected by clicking its rendering', async ( {
		editor,
		page,
	} ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		const latex = page.getByRole( 'textbox', {
			name: 'LaTeX math syntax',
		} );

		// The rendering takes no pointer events, so the click lands on the
		// wrapper the editor selects.
		await formulas.first().click();
		await expect( latex ).toHaveValue( '\\sqrt{a^2+b^2}' );
		await expect( formulas.first() ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);

		// Straight to the other one: the popover follows.
		const before = await latex.boundingBox();
		await formulas.last().click();
		await expect( latex ).toHaveValue( '\\frac{1}{2}' );
		await expect( formulas.last() ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
		expect( ( await latex.boundingBox() ).x ).toBeGreaterThan( before.x );
	} );

	test( 'keeps its rendering while the text around it is edited', async ( {
		editor,
		page,
	} ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		const rendered = () =>
			formulas.evaluateAll( ( elements ) =>
				elements.map(
					( element ) =>
						!! element.shadowRoot?.querySelector( '.katex' )
				)
			);
		await expect.poll( rendered ).toEqual( [ true, true ] );

		await editor.canvas.getByText( 'end.' ).click();
		await page.keyboard.press( 'End' );
		await page.keyboard.type( ' More text.' );
		await page.keyboard.press( 'Home' );
		await page.keyboard.type( 'Start: ' );

		await expect( formulas ).toHaveCount( 2 );
		expect( await rendered() ).toEqual( [ true, true ] );
		const content = await editor.getEditedPostContent();
		expect( content ).toContain( '<p>Start: Inline <math' );
		expect( content ).toContain( 'end. More text.</p>' );
		expect( content ).not.toContain( 'katex' );
	} );

	test( 'renders a formula changed through the popover', async ( {
		editor,
		page,
	} ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		const latex = page.getByRole( 'textbox', {
			name: 'LaTeX math syntax',
		} );

		await formulas.last().click();
		await latex.fill( 'x^3' );

		await expect
			.poll( () =>
				formulas
					.last()
					.evaluate(
						( element ) =>
							element.shadowRoot?.querySelector( '.katex' )
								?.textContent
					)
			)
			.toContain( 'x3' );
		const content = await editor.getEditedPostContent();
		expect( content ).toContain(
			'<annotation encoding="application/x-tex">x^3</annotation>'
		);
	} );
} );
