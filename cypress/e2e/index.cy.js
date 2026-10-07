// Ruta: cypress/e2e/index.cy.js
// Prueba E2E del flujo de login de ModaUno, usando la cuenta demo del modal de ingreso.
describe('Flujo de Login', () => {
  beforeEach(() => {
    cy.visit('/') // la baseUrl (http://localhost:8080) está en cypress.config.js

    // Abre el modal desde el navbar y va a la pestaña "Ingresar"
    cy.get('[data-test="login-btn"]').click()
    cy.get('[data-test="auth-tab-login"]').click()
  })

  it('Usuario puede iniciar sesión', () => {
    cy.get('[data-test="auth-email"] input').type('cliente@modauno.cl')
    cy.get('[data-test="auth-password"] input').type('Demo1234')
    cy.get('[data-test="auth-submit"]').click()

    // Con sesión iniciada aparece el menú de la cuenta con el nombre del usuario
    cy.get('[data-test="user-menu"]').click()
    cy.contains('Cliente Demo').should('be.visible')
    cy.screenshot('login-exitoso')
  })

  it('Muestra un error si la contraseña es incorrecta', () => {
    cy.get('[data-test="auth-email"] input').type('cliente@modauno.cl')
    cy.get('[data-test="auth-password"] input').type('clave-incorrecta')
    cy.get('[data-test="auth-submit"]').click()

    cy.get('[data-test="auth-error"]').should('contain.text', 'incorrectos')
    cy.get('[data-test="user-menu"]').should('not.exist')
    cy.screenshot('login-error')
  })

  it('Usuario puede cerrar sesión', () => {
    cy.get('[data-test="auth-email"] input').type('cliente@modauno.cl')
    cy.get('[data-test="auth-password"] input').type('Demo1234')
    cy.get('[data-test="auth-submit"]').click()

    cy.get('[data-test="user-menu"]').click()
    cy.get('[data-test="logout-btn"]').click()

    // Sin sesión vuelve a aparecer el botón "Ingresar"
    cy.get('[data-test="login-btn"]').should('be.visible')
  })
})
