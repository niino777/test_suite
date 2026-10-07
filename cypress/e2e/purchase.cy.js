// Pruebas E2E de la compra simulada: carrito, ingreso con cuenta demo, pago y pedido.
// Cada prueba parte con el navegador limpio (sin carrito ni sesión).

// Agrega el primer producto del catálogo y abre el carrito
const addProductAndOpenCart = () => {
  cy.get('[data-test="add-to-cart-btn"]').first().click()
  cy.get('[data-test="cart-btn"]').click()
}

// Llega al checkout: sin sesión, "Ir a pagar" abre el modal y entramos con el cliente demo
const goToCheckout = () => {
  addProductAndOpenCart()
  cy.get('[data-test="checkout-btn"]').click()
  cy.get('[data-test="demo-customer-btn"]').click()

  cy.get('[data-test="cart-btn"]').click()
  cy.get('[data-test="checkout-btn"]').click()
  cy.url().should('include', '/checkout')
}

const fillDeliveryData = () => {
  cy.get('[data-test="checkout-phone"] input').type('+56 9 1234 5678')
  cy.get('[data-test="checkout-address"] input').type('Av. Siempre Viva 123')
  cy.get('[data-test="checkout-commune"] input').type('Santiago')
}

describe('Compra simulada', () => {
  beforeEach(() => {
    cy.visit('/catalogo')
  })

  it('agrega un producto y lo ve en el carrito', () => {
    addProductAndOpenCart()

    cy.get('[data-test="cart-item"]').should('have.length', 1)
    cy.get('[data-test="cart-total"]').should('contain.text', '$')
    cy.screenshot('carrito-con-producto')
  })

  it('cambia la cantidad y elimina el producto', () => {
    addProductAndOpenCart()

    cy.get('button[aria-label="Agregar una unidad"]').click()
    cy.get('[data-test="cart-qty"]').should('have.text', '2')

    cy.get('button[aria-label="Eliminar producto"]').click()
    cy.contains('Tu carrito está vacío').should('be.visible')
  })

  it('pide iniciar sesión para pagar', () => {
    addProductAndOpenCart()
    cy.get('[data-test="checkout-btn"]').click()

    cy.contains('Tu cuenta ModaUno').should('be.visible')
    cy.get('[data-test="demo-customer-btn"]').should('be.visible')
  })

  it('completa la compra y ve el pedido confirmado', () => {
    goToCheckout()
    fillDeliveryData()
    cy.get('[data-test="pay-btn"]').click()

    cy.url().should('include', '/pedido/MU-')
    cy.get('[data-test="order-title"]').should('contain.text', 'Pedido MU-')
    cy.get('[data-test="order-status"]').should('contain.text', 'Pagado')
    cy.screenshot('pedido-confirmado')
  })

  it('muestra un error si el pago es rechazado', () => {
    goToCheckout()
    fillDeliveryData()
    cy.contains('label', 'Simular pago rechazado').click()
    cy.get('[data-test="pay-btn"]').click()

    cy.get('[data-test="payment-error"]').should('contain.text', 'rechazado')
    cy.url().should('include', '/checkout')
    cy.screenshot('pago-rechazado')
  })

  it('guarda la compra en "Mis compras"', () => {
    goToCheckout()
    fillDeliveryData()
    cy.get('[data-test="pay-btn"]').click()
    cy.url().should('include', '/pedido/MU-')

    cy.visit('/mis-compras')
    cy.get('[data-test="order-row"]').should('have.length', 1)
  })
})
