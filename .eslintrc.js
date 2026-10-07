module.exports = {
  root: true,
  env: { node: true, browser: true, es2022: true },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: 'error'
  },
  overrides: [
    { files: ['tests/unit/**/*.js'], env: { jest: true } },
    {
      // Pruebas E2E: globals de Cypress (cy, describe, it...) y reglas recomendadas del plugin
      files: ['cypress/**/*.js'],
      env: { 'cypress/globals': true },
      extends: ['plugin:cypress/recommended']
    }
  ]
}
