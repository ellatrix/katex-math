const { defineConfig } = require( '@playwright/test' );

process.env.WP_BASE_URL ??= 'http://localhost:8991';

const base = require( '@wordpress/scripts/config/playwright.config' );

module.exports = defineConfig( {
	...base,
	testDir: './test/e2e',
} );
