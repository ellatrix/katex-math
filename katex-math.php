<?php
/**
 * Plugin Name:       KaTeX Math Rendering
 * Description:       Renders the math of the Math block and the inline math format with KaTeX. The saved content stays MathML.
 * Version:           0.1.0
 * Requires at least: 6.9
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       katex-math
 *
 * @package katex-math
 */

defined( 'ABSPATH' ) || exit;

// Written by bin/update-katex.sh.
define( 'KATEX_MATH_KATEX_VERSION', '0.18.7' );

/**
 * Registers KaTeX and the two scripts that use it.
 */
function katex_math_register_assets() {
	$vendor = plugins_url( 'vendor/katex/', __FILE__ );
	$assets = plugins_url( 'assets/', __FILE__ );

	wp_register_style( 'katex-math-lib', $vendor . 'katex.min.css', array(), KATEX_MATH_KATEX_VERSION );
	// KaTeX enlarges its output by 21% to make up for the small x-height of
	// its fonts. The browser renders the MathML at the text size, so keep
	// that: the plugin changes the typesetting, not the size, and a theme
	// sizes `math` and `.katex` alike. A display formula also brings its own
	// vertical margin, the Math block already has the block spacing.
	wp_add_inline_style( 'katex-math-lib', '.katex{font-size:1em}.wp-block-math .katex-display{margin:0}' );

	wp_register_script( 'katex-math-lib', $vendor . 'katex.min.js', array(), KATEX_MATH_KATEX_VERSION, true );

	// In the footer and not deferred: it runs as soon as the content is parsed,
	// so the formulas are swapped before they are painted as MathML.
	// The file time rather than the plugin version, so an edited script is never
	// served from the browser cache.
	foreach ( array( 'view', 'editor' ) as $name ) {
		wp_register_script( "katex-math-$name", $assets . "$name.js", array( 'katex-math-lib' ), filemtime( __DIR__ . "/assets/$name.js" ), true );
	}
}
add_action( 'init', 'katex_math_register_assets' );

/**
 * Loads KaTeX on the front end once a rendered block contains math.
 *
 * Inline math can be in any block, so every block is checked rather than the
 * Math block alone.
 *
 * @param string $block_content The rendered block.
 * @return string The rendered block, unchanged.
 */
function katex_math_enqueue_for_block( $block_content ) {
	static $enqueued = false;

	// The string search keeps the tag processor away from the blocks without
	// math, which are nearly all of them.
	if ( $enqueued || false === stripos( $block_content, '<math' ) ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );
	if ( $processor->next_tag( 'MATH' ) ) {
		$enqueued = true;
		wp_enqueue_style( 'katex-math-lib' );
		wp_enqueue_script( 'katex-math-view' );
	}

	return $block_content;
}
add_filter( 'render_block', 'katex_math_enqueue_for_block' );

/**
 * Keeps typographic replacements out of the math.
 *
 * On the front end `wptexturize()` turns ` - ` into an en dash and straight
 * quotes into curly ones, also in the LaTeX source inside the MathML, which
 * KaTeX would then typeset as written.
 *
 * @param string[] $tags Names of the elements whose content is left alone.
 * @return string[] The names, with `math` added.
 */
function katex_math_no_texturize( $tags ) {
	$tags[] = 'math';
	return $tags;
}
add_filter( 'no_texturize_tags', 'katex_math_no_texturize' );

/**
 * Loads KaTeX in the editor canvas.
 *
 * Assets enqueued on this hook are loaded inside the editor's iframe, which is
 * where the script has to run.
 */
function katex_math_enqueue_editor_assets() {
	if ( ! is_admin() ) {
		return;
	}

	wp_enqueue_style( 'katex-math-lib' );
	wp_enqueue_script( 'katex-math-editor' );
}
add_action( 'enqueue_block_assets', 'katex_math_enqueue_editor_assets' );
