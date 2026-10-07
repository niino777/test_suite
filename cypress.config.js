const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    baseUrl: 'http://localhost:8080', // el puerto donde corre Vue CLI
    supportFile: false,
    video: true,
    screenshotOnRunFailure: true
  }
})
