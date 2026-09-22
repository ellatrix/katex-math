#!/usr/bin/env bash
# Fetches a KaTeX release from npm into vendor/katex.
# Usage: bin/update-katex.sh [version]   (defaults to the latest release)
set -euo pipefail

cd "$( dirname "$0" )/.."
version="${1:-latest}"
tmp="$( mktemp -d )"
trap 'rm -rf "$tmp"' EXIT

( cd "$tmp" && npm pack --silent "katex@$version" >/dev/null && tar -xzf katex-*.tgz )

rm -rf vendor/katex
mkdir -p vendor/katex/fonts
cp "$tmp/package/dist/katex.min.js" "$tmp/package/dist/katex.min.css" "$tmp/package/LICENSE" vendor/katex/
# The stylesheet lists woff2 first and every supported browser takes it, so
# the woff and ttf copies are never requested.
cp "$tmp"/package/dist/fonts/*.woff2 vendor/katex/fonts/

resolved="$( node -p "require('$tmp/package/package.json').version" )"
sed -i.bak -E "s/(define\( 'KATEX_MATH_KATEX_VERSION', ')[^']*/\1$resolved/" katex-math.php && rm katex-math.php.bak
echo "KaTeX $resolved"
