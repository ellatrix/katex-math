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
		// Selected, and shown as such: the highlight is the only sign, as
		// nothing inside the wrapper is selectable.
		await expect( formulas.first() ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
		await expect( formulas.first() ).not.toHaveCSS(
			'background-color',
			'rgba(0, 0, 0, 0)'
		);
	} );

	test( 'hands the popover to the formula clicked next', async ( {
		editor,
		page,
		browserName,
	} ) => {
		test.fixme(
			browserName === 'firefox',
			'Gutenberg 24.0: the popover keeps the first formula (fixed on trunk in WordPress/gutenberg#83370).'
		);
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		const latex = page.getByRole( 'textbox', {
			name: 'LaTeX math syntax',
		} );

		await formulas.first().click();
		await expect( latex ).toHaveValue( '\\sqrt{a^2+b^2}' );

		// Straight to the other one, without going through the text in
		// between: the popover shows that one, at its position.
		const before = await latex.boundingBox();
		await formulas.last().click();
		await expect( latex ).toHaveValue( '\\frac{1}{2}' );
		await expect( formulas.last() ).toHaveAttribute(
			'data-rich-text-format-boundary',
			'true'
		);
		expect( ( await latex.boundingBox() ).x ).toBeGreaterThan( before.x );
	} );

	test( 'takes only the space of its rendering', async ( { editor } ) => {
		const formulas = editor.canvas.locator( '[data-rich-text-bogus]' );
		await expect
			.poll( () =>
				formulas.evaluateAll( ( elements ) =>
					elements.map( ( element ) => {
						const katex =
							element.shadowRoot?.querySelector( '.katex' );
						return katex
							? Math.abs(
									element.getBoundingClientRect().width -
										katex.getBoundingClientRect().width
								) < 2
							: null;
					} )
				)
			)
			.toEqual( [ true, true ] );
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
