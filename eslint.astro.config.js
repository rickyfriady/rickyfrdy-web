// eslint.astro.config.js
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.astro'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-conflict-set-directives': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/alt-text': 'error'
    }
  }
]
