export default {
  '*.{ts,tsx,js,mjs,cjs}': ['biome check --write --unsafe --no-errors-on-unmatched'],
  '*.astro': ['eslint --fix --config eslint.astro.config.js'],
  '*.{json,css,html}': ['biome format --write --no-errors-on-unmatched']
}
