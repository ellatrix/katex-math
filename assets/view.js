/**
 * Front end: replaces each formula with its KaTeX rendering.
 *
 * The LaTeX source is the annotation that the Math block and the inline math
 * format save inside the MathML. A formula KaTeX cannot render is left alone,
 * so it stays the browser's MathML.
 */
( function () {
	const { katex } = window;

	if ( ! katex ) {
		return;
	}

	for ( const math of document.querySelectorAll( 'math' ) ) {
		const annotation = math.querySelector(
			'annotation[encoding="application/x-tex"]'
		);

		if ( ! annotation ) {
			continue;
		}

		const container = document.createElement( 'span' );

		try {
			katex.render( annotation.textContent, container, {
				displayMode: math.getAttribute( 'display' ) === 'block',
				// KaTeX adds its own visually hidden MathML, so assistive
				// technology still gets the formula.
				output: 'htmlAndMathml',
				throwOnError: true,
			} );
		} catch {
			continue;
		}

		math.replaceWith( container );
	}
} )();
