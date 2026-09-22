/**
 * Editor canvas: shows each formula as its KaTeX rendering, without touching
 * what is saved.
 *
 * The rendering goes into a shadow root on the formula's parent. The editor
 * reads and compares the regular DOM only, so it never sees the rendering: the
 * `<math>` element stays where it is, stays the thing that gets saved, and
 * stays available to assistive technology. A `<slot>` keeps it in the DOM,
 * with no size and transparent.
 */

/* global Element, CSSStyleSheet, CSSRule, MutationObserver */

( function () {
	const { katex } = window;

	// No `document.body` here: in the editor's iframe the script runs from the
	// head, before the body exists.
	if ( ! katex || ! Element.prototype.attachShadow ) {
		return;
	}

	// The wrapper of an inline formula in rich text, and the Math block.
	const HOSTS = '[data-rich-text-bogus], .wp-block-math';
	const ANNOTATION = 'annotation[encoding="application/x-tex"]';

	const ownSheet = new CSSStyleSheet();
	ownSheet.replaceSync(
		// The same two overrides as on the front end: the text size rather
		// than KaTeX's enlargement, and no margin of its own in the block.
		'.katex{font-size:1em}.katex-display{margin:0}' +
			// The slot is sized rather than the `<math>` in it: Firefox lays
			// MathML out on its own terms and ignores a width on the element,
			// a box around it is clipped by every engine.
			'slot.is-replaced{display:inline-block;width:0;height:0;overflow:hidden}' +
			// In the block an inline-level box would add an empty line.
			':host(.wp-block-math) slot.is-replaced{display:block}' +
			'slot.is-replaced::slotted(math){opacity:0;pointer-events:none}' +
			// Inline: the rendering takes no mouse, so a click lands on the
			// wrapper, which the editor selects as it does for the `<math>`.
			// Nothing in here is selectable either: Safari would otherwise
			// paint the selection over and beyond the rendering.
			':host([data-rich-text-bogus]) span,:host([data-rich-text-bogus]) ::slotted(math){pointer-events:none;user-select:none;-webkit-user-select:none}'
	);

	let katexSheet;

	/**
	 * Copies KaTeX's rules from the document into a sheet the shadow roots can
	 * share. Rules of the document do not apply inside a shadow root. The font
	 * faces are left out: they only register from the document, where the
	 * stylesheet is loaded as well.
	 *
	 * @return {boolean} Whether the rules are available yet.
	 */
	function prepareKatexSheet() {
		if ( katexSheet ) {
			return true;
		}

		const link = document.getElementById( 'katex-math-lib-css' );
		let rules;

		try {
			rules = link?.sheet?.cssRules;
		} catch {
			// Not readable, for example served from another origin.
		}

		if ( ! rules ) {
			link?.addEventListener( 'load', scan, { once: true } );
			return false;
		}

		let css = '';
		for ( const rule of rules ) {
			if ( rule.type !== CSSRule.FONT_FACE_RULE ) {
				css += rule.cssText;
			}
		}

		katexSheet = new CSSStyleSheet();
		katexSheet.replaceSync( css );
		return true;
	}

	function getLatex( math ) {
		return (
			math.querySelector( ANNOTATION )?.textContent ??
			math.getAttribute( 'data-latex' ) ??
			''
		);
	}

	function render( math ) {
		const host = math.parentElement;
		const displayMode = math.getAttribute( 'display' ) === 'block';
		const key = ( displayMode ? 'block:' : 'inline:' ) + getLatex( math );

		// The editor reuses the wrapper when a formula changes, so the source
		// decides whether there is anything to do, not the element.
		if ( host.shadowRoot && host.shadowRoot.katexMathKey === key ) {
			return;
		}

		let root = host.shadowRoot;
		if ( ! root ) {
			root = host.attachShadow( { mode: 'open' } );
			root.adoptedStyleSheets = [ katexSheet, ownSheet ];
			root.innerHTML = '<span aria-hidden="true"></span><slot></slot>';
		}

		const [ output, slot ] = root.children;
		let html = '';

		try {
			html = katex.renderToString( getLatex( math ), {
				displayMode,
				output: 'html',
				throwOnError: true,
			} );
		} catch {
			// Leave the formula to the browser's MathML.
		}

		output.innerHTML = html;
		slot.classList.toggle( 'is-replaced', html !== '' );
		root.katexMathKey = key;
	}

	function scan() {
		if ( ! prepareKatexSheet() ) {
			return;
		}

		for ( const math of document.querySelectorAll( 'math' ) ) {
			if ( math.parentElement?.matches( HOSTS ) ) {
				render( math );
			}
		}
	}

	// Observer callbacks run before the next paint, so a new or changed formula
	// is never shown as MathML first. Changes inside the shadow roots are not
	// reported, so rendering does not trigger another scan.
	new MutationObserver( scan ).observe( document.documentElement, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: [ 'data-latex' ],
	} );

	scan();
} )();
