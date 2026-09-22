const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const { defineConfig, devices } = require( '@playwright/test' );

process.env.WP_BASE_URL ??= 'http://localhost:8991';

const base = require( '@wordpress/scripts/config/playwright.config' );

/**
 * On macOS 27 the app data folder of the installed Firefox is protected, and
 * the Firefox Playwright runs resolves its own app data to the same folder,
 * so it fails to start. Giving CoreFoundation another home puts that folder
 * in a scratch directory. See https://github.com/microsoft/playwright/issues/42768.
 *
 * @return {Object} Environment for the Firefox process.
 */
function firefoxEnv() {
	if ( process.platform !== 'darwin' ) {
		return {};
	}
	const home = path.join( os.tmpdir(), 'playwright-firefox-home' );
	fs.mkdirSync( path.join( home, 'Library', 'Application Support' ), {
		recursive: true,
	} );
	return { CFFIXED_USER_HOME: home };
}

module.exports = defineConfig( {
	...base,
	testDir: './test',
	// The readme screenshots are taken on request, see test/screenshots.
	...( process.env.SCREENSHOTS
		? { grep: /@screenshots/ }
		: { grepInvert: /@screenshots/ } ),
	projects: [
		{
			name: 'chromium',
			// The full build: the headless shell Playwright runs by default
			// lays MathML out without the font's MATH table, so stretchy
			// delimiters and limits come out wrong.
			use: { ...devices[ 'Desktop Chrome' ], channel: 'chromium' },
		},
		{ name: 'webkit', use: { ...devices[ 'Desktop Safari' ] } },
		{
			name: 'firefox',
			use: {
				...devices[ 'Desktop Firefox' ],
				launchOptions: { env: { ...process.env, ...firefoxEnv() } },
			},
		},
	],
} );
