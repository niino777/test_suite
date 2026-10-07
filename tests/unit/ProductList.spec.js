import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import store from '@/store'
import ProductList from '@/components/ProductList.vue'
import { getProducts } from '@/services/productService'

// Simulamos que la API falla
jest.mock('@/services/productService', () => ({
  getProducts: jest.fn()
}))

const vuetify = createVuetify({ components, directives })

describe('ProductList', () => {
  it('muestra un mensaje de error cuando la API falla', async () => {
    getProducts.mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(ProductList, {
      global: { plugins: [vuetify, store], stubs: { RouterLink: RouterLinkStub } }
    })
    await flushPromises()

    const alert = wrapper.find('[data-test="error-message"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('No pudimos cargar los productos')
    expect(wrapper.find('[data-test="product-card"]').exists()).toBe(false)
  })
})
