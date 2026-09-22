const { defineConfig, devices } = require( '@playwright/test' );

process.env.WP_BASE_URL ??= 'http://localhost:8991';

const base = require( '@wordpress/scripts/config/playwright.config' );

module.exports = defineConfig( {
	...base,
	testDir: './test',
	// The readme screenshots are taken on request, see test/screenshots.
	...( process.env.SCREENSHOTS
		? { grep: /@screenshots/ }
		: { grepInvert: /@screenshots/ } ),
	projects: [
		{ name: 'chromium', use: { ...devices[ 'Desktop Chrome' ] } },
		{ name: 'webkit', use: { ...devices[ 'Desktop Safari' ] } },
		{ name: 'firefox', use: { ...devices[ 'Desktop Firefox' ] } },
	],
} );
