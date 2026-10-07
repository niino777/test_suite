// Pruebas E2E del catálogo.
// Cypress abre el sitio real (npm run serve) y lo usa como un usuario.
// Los elementos se buscan con atributos data-test, que no cambian aunque cambie el diseño.

const categoryNav = 'nav[aria-label="Filtrar por categoría"]'
const typeNav = 'nav[aria-label="Filtrar por tipo de prenda"]'

describe('Catálogo', () => {
  beforeEach(() => {
    cy.visit('/catalogo')
  })

  it('muestra los productos', () => {
    cy.contains('h1', 'Catálogo')
    cy.get('[data-test="product-card"]').should('have.length.greaterThan', 5)
    cy.screenshot('catalogo-completo')
  })

  it('el usuario filtra por Calzado y ve solo calzado', () => {
    cy.get(categoryNav).contains('.v-chip', 'Calzado').click()

    cy.url().should('include', '/catalogo/calzado')
    cy.get('[data-test="product-card"]').should('have.length.greaterThan', 0)
    cy.get('[data-test="product-card"]').each((card) => {
      cy.wrap(card).should('contain.text', 'Calzado')
    })
    cy.screenshot('catalogo-calzado')
  })

  it('filtra por tipo de prenda en una subruta', () => {
    cy.get(categoryNav).contains('.v-chip', 'Ropa Infantil').click()
    cy.get(typeNav).contains('.v-chip', 'Vestidos').click()

    cy.url().should('include', '/catalogo/ropa-infantil/vestidos')
    cy.get('[data-test="product-card"]').each((card) => {
      cy.wrap(card).should('contain.text', 'Vestido')
    })
    cy.screenshot('catalogo-infantil-vestidos')
  })

  it('busca un producto por nombre', () => {
    cy.get('[data-test="search-input"] input').type('botas')

    cy.get('[data-test="product-card"]').should('have.length', 1)
    cy.get('[data-test="product-card"]').should('contain.text', 'Botas de cuero café')
  })

  it('avisa cuando no hay resultados', () => {
    cy.get('[data-test="search-input"] input').type('zzzz')

    cy.get('[data-test="empty-message"]').should('contain.text', 'No encontramos productos')
    cy.get('[data-test="product-card"]').should('not.exist')
  })

  it('abre el detalle de un producto', () => {
    cy.get('[data-test="product-card"] a').first().click()

    cy.url().should('include', '/producto/')
    cy.get('[data-test="detail-add-btn"]').should('be.visible')
    cy.screenshot('detalle-producto')
  })
})
